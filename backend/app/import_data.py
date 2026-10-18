"""Import an approved, complete business dataset; never run automatically.

Usage: python -m app.import_data approved-business-data.json
The input schema is available via python -m app.import_data --schema.
"""

import argparse
import asyncio
import json
from decimal import Decimal
from pathlib import Path

from sqlalchemy import delete, select, update
from sqlalchemy.orm import selectinload

from app.database import async_session, engine
from app.import_schema import BusinessImport
from app.models import (
    ContentSection,
    DataRelease,
    Location,
    Practitioner,
    PractitionerDay,
    PractitionerOffering,
    PractitionerShift,
    SignatureFavorite,
    Treatment,
    TreatmentFormulation,
    TreatmentStep,
)


async def publish_practitioners(session, payload: BusinessImport):
    for item in payload.practitioners:
        row = await session.get(
            Practitioner,
            item.id,
            options=[selectinload(Practitioner.available_days)],
        )
        values = item.model_dump(exclude={"days"})
        if row is None:
            row = Practitioner(**values, active=True)
            session.add(row)
        else:
            for key, value in values.items():
                setattr(row, key, value)
            row.active = True
        row.available_days = [PractitionerDay(day=day) for day in item.days]


async def publish_treatments(session, payload: BusinessImport):
    for item in payload.treatments:
        row = await session.get(
            Treatment,
            item.id,
            options=[
                selectinload(Treatment.formulations),
                selectinload(Treatment.steps),
            ],
        )
        values = item.model_dump(exclude={"formulations", "steps"})
        amount = Decimal(item.price_minor) / 100
        values.update(
            price=f"{amount:.2f} {item.currency}",
            numeric_price=amount,
            duration=f"{item.duration_minutes} min",
            active=True,
        )
        if row is None:
            row = Treatment(**values)
            session.add(row)
        else:
            for key, value in values.items():
                setattr(row, key, value)
            # Flush child removals before reusing unique step ordering.
            row.formulations.clear()
            row.steps.clear()
            await session.flush()
        row.formulations = [
            TreatmentFormulation(name=name) for name in item.formulations
        ]
        row.steps = [
            TreatmentStep(order=i + 1, description=description)
            for i, description in enumerate(item.steps)
        ]


async def publish_editorial_sections(session, payload: BusinessImport):
    await session.execute(update(ContentSection).values(published=False))
    for key, data in payload.sections.items():
        existing = await session.get(ContentSection, key)
        if existing:
            existing.data, existing.published = data, True
            existing.revision += 1
        else:
            session.add(ContentSection(key=key, data=data, published=True))


async def import_business_data(payload: BusinessImport):
    """Complete catalog publication. Existing bookings/PII are preserved."""
    async with async_session() as session:
        async with session.begin():
            if await session.get(DataRelease, payload.release_id):
                raise ValueError(
                    "This release has already been imported; use a new release_id"
                )
            # Serialize against reservations and concurrent imports before publishing inventory.
            await session.execute(
                select(Location.id).order_by(Location.id).with_for_update()
            )
            await session.execute(
                select(Practitioner.id).order_by(Practitioner.id).with_for_update()
            )
            for cls in (Treatment, Location, Practitioner, SignatureFavorite):
                await session.execute(update(cls).values(active=False))
            for item in payload.locations:
                await session.merge(Location(**item.model_dump(), active=True))
            await publish_practitioners(session, payload)
            await publish_treatments(session, payload)
            for item in payload.favorites:
                values = item.model_dump()
                values.update(
                    price=f"{Decimal(item.price_minor) / 100:.2f} {item.currency}",
                    active=True,
                )
                await session.merge(SignatureFavorite(**values))
            await session.flush()
            await session.execute(delete(PractitionerOffering))
            await session.execute(delete(PractitionerShift))
            session.add_all(
                [PractitionerOffering(**x.model_dump()) for x in payload.offerings]
            )
            session.add_all(
                [PractitionerShift(**x.model_dump()) for x in payload.shifts]
            )
            await publish_editorial_sections(session, payload)
            session.add(
                DataRelease(id=payload.release_id, approved_by=payload.approved_by)
            )


async def run(path):
    data = BusinessImport.model_validate_json(Path(path).read_text(encoding="utf-8"))
    try:
        await import_business_data(data)
    finally:
        await engine.dispose()
    print(f"Approved release {data.release_id} imported. No bookings were deleted.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?")
    parser.add_argument("--schema", action="store_true")
    args = parser.parse_args()
    if args.schema:
        print(json.dumps(BusinessImport.model_json_schema(), indent=2))
    elif args.path:
        asyncio.run(run(args.path))
    else:
        parser.error("provide an approved JSON file or --schema")
