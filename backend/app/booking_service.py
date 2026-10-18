"""Allocate reservations atomically and preserve their original confirmation details."""

import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.firebase_auth import AuthUser
from app.models import Booking, Location, Practitioner
from app.scheduling import (
    available_practitioners,
    eligible_practitioner_ids,
    load_booking_catalog,
    load_schedule,
    local_start_to_utc,
)
from app.schemas import BookingConfirmation, BookingCreate
from app.security import token_hash


async def reserve_booking(
    payload: BookingCreate,
    user: AuthUser,
    idempotency_key: str | None,
    db: AsyncSession,
) -> BookingConfirmation:
    # Row locks span allocation and commit.
    await db.execute(
        select(Location.id)
        .where(Location.id == payload.location_id)
        .with_for_update()
    )
    request_hash = token_hash(payload.model_dump_json())
    if idempotency_key:
        idempotency_key = token_hash(user.uid + ":" + idempotency_key)
        existing = (
            await db.execute(
                select(Booking).where(Booking.idempotency_key == idempotency_key)
            )
        ).scalar_one_or_none()
        if existing:
            if (
                existing.request_hash != request_hash
                or not existing.confirmation_snapshot
            ):
                raise HTTPException(
                    409,
                    "This request key belongs to another reservation. Check your reservations.",
                )
            snapshot = dict(existing.confirmation_snapshot)
            snapshot["status"] = existing.status
            return BookingConfirmation.model_validate(snapshot)
    location, treatment, extra = await load_booking_catalog(
        db, payload.location_id, payload.treatment_id, payload.addon
    )
    starts_at = local_start_to_utc(payload.date, payload.time, location.timezone)
    now = datetime.now(timezone.utc)
    if starts_at <= now or starts_at > now + timedelta(days=90):
        raise HTTPException(422, "Select an upcoming time within the next 90 days")
    ends_at = starts_at + timedelta(
        minutes=treatment.duration_minutes + (extra.duration_minutes if extra else 0)
    )
    ids = await eligible_practitioner_ids(
        db, location.id, treatment.id, payload.practitioner_id
    )
    if ids:
        await db.execute(
            select(Practitioner.id)
            .where(Practitioner.id.in_(ids))
            .order_by(Practitioner.id)
            .with_for_update()
        )
    shifts, bookings = await load_schedule(
        db, location.id, treatment.id, starts_at, ends_at, payload.practitioner_id
    )
    available = available_practitioners(
        shifts, bookings, starts_at, ends_at, location.id, location.timezone
    )
    if not available:
        raise HTTPException(
            409, "This time is no longer available. Select another time."
        )
    practitioner = await db.get(Practitioner, available[0])
    management_token = secrets.token_urlsafe(32)
    total = treatment.price_minor + (extra.price_minor if extra else 0)
    booking = Booking(
        reference="RBD-" + secrets.token_hex(10).upper(),
        treatment_id=treatment.id,
        location_id=location.id,
        practitioner_id=practitioner.id,
        firebase_uid=user.uid,
        date=payload.date,
        time=payload.time,
        starts_at=starts_at,
        ends_at=ends_at,
        total_price_minor=total,
        currency=location.currency,
        management_token_hash=token_hash(management_token),
        idempotency_key=idempotency_key,
        request_hash=request_hash,
        silent_chair=payload.silent_chair,
        addon=extra.name if extra else None,
        guest_name=payload.guest_name,
        guest_email=str(payload.guest_email),
        guest_phone=payload.guest_phone,
        guest_notes=payload.guest_notes,
        status="confirmed",
    )
    confirmation = BookingConfirmation(
        reference=booking.reference,
        service=treatment.title,
        price=f"{total / 100:.2f} {location.currency}",
        duration=f"{int((ends_at - starts_at).total_seconds() / 60)} min",
        location=f"{location.city} ({location.neighborhood})",
        address=location.address,
        practitioner=practitioner.name,
        date=booking.date,
        time=booking.time,
        guest_name=booking.guest_name,
        guest_email=booking.guest_email,
        silent_chair=booking.silent_chair,
        addon=booking.addon,
        status=booking.status,
        starts_at=starts_at,
        ends_at=ends_at,
        total_price_minor=total,
        currency=location.currency,
    )
    booking.confirmation_snapshot = confirmation.model_dump(mode="json")
    db.add(booking)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            409,
            "The reservation could not be allocated. Refresh availability and try again.",
        ) from None
    confirmation.management_token = management_token
    return confirmation
