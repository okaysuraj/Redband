"""Live schedule inventory; dates and slots are never generated without DB shifts."""

from datetime import date as Date
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import SignatureFavorite
from app.scheduling import (
    SLOT_MINUTES,
    as_utc,
    available_practitioners,
    load_booking_catalog,
    load_schedule,
    local_start_to_utc,
)
from app.schemas import (
    AvailabilityOut,
    AvailableDateOut,
    SignatureFavoriteOut,
    TimeSlotOut,
)

router = APIRouter(prefix="/api/availability", tags=["Availability"])


@router.get("", response_model=AvailabilityOut)
async def get_availability(
    date: Date | None = None,
    location_id: str | None = Query(default=None, max_length=64),
    treatment_id: str | None = Query(default=None, max_length=64),
    practitioner_id: str | None = Query(default=None, max_length=64),
    addon: str | None = Query(default=None, max_length=120),
    db: AsyncSession = Depends(get_db),
):
    if not location_id or not treatment_id:
        return AvailabilityOut(dates=[], time_slots=[])
    location, treatment, extra = await load_booking_catalog(
        db, location_id, treatment_id, addon
    )
    zone = ZoneInfo(location.timezone)
    now = datetime.now(timezone.utc)
    horizon = now + timedelta(days=90)
    if date and (
        date < now.astimezone(zone).date() or date > horizon.astimezone(zone).date()
    ):
        raise HTTPException(422, "Select a date within the next 90 days")
    shifts, bookings = await load_schedule(
        db, location_id, treatment_id, now, horizon, practitioner_id
    )
    duration = timedelta(
        minutes=treatment.duration_minutes + (extra.duration_minutes if extra else 0)
    )
    dates = set()
    starts = set()
    potentials = set()
    for shift in shifts:
        cursor = as_utc(shift.starts_at)
        stop = min(as_utc(shift.ends_at), horizon)
        while cursor + duration <= stop:
            local = cursor.astimezone(zone)
            if cursor > now:
                # Ambiguous local times cannot be selected using the public wall-time API.
                try:
                    roundtrip = local_start_to_utc(
                        local.date().isoformat(),
                        local.strftime("%I:%M %p"),
                        location.timezone,
                    )
                except HTTPException:
                    roundtrip = None
                if roundtrip == cursor:
                    potentials.add(cursor)
            cursor += timedelta(minutes=SLOT_MINUTES)
    for start in sorted(potentials):
        if available_practitioners(
            shifts,
            bookings,
            start,
            start + duration,
            location_id,
            location.timezone,
            first_only=True,
        ):
            local = start.astimezone(zone)
            dates.add(local.date())
            if date is None or local.date() == date:
                starts.add(start)
    dates_out = [
        AvailableDateOut(
            date=d.isoformat(), day_name=d.strftime("%a, %b %d"), label=d.strftime("%A")
        )
        for d in sorted(dates)
    ]
    selected = date or (min(dates) if dates else None)
    slots = []
    for start in sorted(starts):
        local = start.astimezone(zone)
        if local.date() != selected:
            continue
        period = (
            "Morning"
            if local.hour < 12
            else "Afternoon"
            if local.hour < 17
            else "Evening"
        )
        slots.append(
            TimeSlotOut(time=local.strftime("%I:%M %p"), period=period, available=True)
        )
    return AvailabilityOut(dates=dates_out, time_slots=slots)


@router.get("/favorites", response_model=list[SignatureFavoriteOut])
async def list_signature_favorites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SignatureFavorite)
        .where(SignatureFavorite.active.is_(True))
        .order_by(SignatureFavorite.code)
    )
    return result.scalars().all()
