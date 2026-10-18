"""UTC booking intervals generated only from approved practitioner working shifts."""

from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import HTTPException
from sqlalchemy import or_, select

from app.models import (
    Booking,
    Location,
    Practitioner,
    PractitionerOffering,
    PractitionerShift,
    SignatureFavorite,
    Treatment,
)

UTC = timezone.utc
SLOT_MINUTES = 15


def as_utc(value: datetime) -> datetime:
    """Normalize booking instants to UTC, including naive legacy timestamps."""
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


def local_start_to_utc(date: str, time: str, zone: str) -> datetime:
    """Translate studio wall time, rejecting ambiguous daylight-saving transitions."""
    naive = datetime.strptime(date + " " + time, "%Y-%m-%d %I:%M %p")
    tz = ZoneInfo(zone)
    local = naive.replace(tzinfo=tz)
    # Reject nonexistent and ambiguous wall times; clients cannot pick an offset.
    if (
        local.astimezone(UTC).astimezone(tz).replace(tzinfo=None) != naive
        or local.utcoffset() != local.replace(fold=1).utcoffset()
    ):
        raise HTTPException(
            422, "This local time is unavailable because of a clock change"
        )
    return local.astimezone(UTC)


async def load_booking_catalog(db, location_id, treatment_id, addon=None):
    """Require active records with compatible currencies before pricing a booking."""
    location = await db.get(Location, location_id)
    treatment = await db.get(Treatment, treatment_id)
    if not location or not location.active or not treatment or not treatment.active:
        raise HTTPException(404, "Location or treatment is unavailable")
    if location.currency != treatment.currency:
        raise HTTPException(409, "Treatment is not priced in the location currency")
    extra = None
    if addon:
        extra = (
            (
                await db.execute(
                    select(SignatureFavorite).where(
                        SignatureFavorite.active.is_(True),
                        or_(
                            SignatureFavorite.code == addon,
                            SignatureFavorite.name == addon,
                        ),
                    )
                )
            )
            .scalars()
            .first()
        )
        if not extra or extra.currency != location.currency:
            raise HTTPException(422, "The selected add-on is unavailable")
    return location, treatment, extra


async def eligible_practitioner_ids(
    db, location_id, treatment_id, practitioner_id=None
):
    """Find active practitioners explicitly assigned to this service and studio."""
    query = (
        select(Practitioner.id)
        .join(
            PractitionerOffering,
            PractitionerOffering.practitioner_id == Practitioner.id,
        )
        .where(
            Practitioner.active.is_(True),
            PractitionerOffering.location_id == location_id,
            PractitionerOffering.treatment_id == treatment_id,
        )
        .order_by(Practitioner.id)
    )
    if practitioner_id and practitioner_id != "any":
        query = query.where(Practitioner.id == practitioner_id)
    return list((await db.execute(query)).scalars().all())


async def load_schedule(
    db, location_id, treatment_id, start, end, practitioner_id=None
):
    """Load shifts and all reservations that can block the studio or its staff."""
    ids = await eligible_practitioner_ids(
        db, location_id, treatment_id, practitioner_id
    )
    if not ids:
        return [], []
    shifts = list(
        (
            await db.execute(
                select(PractitionerShift)
                .where(
                    PractitionerShift.location_id == location_id,
                    PractitionerShift.practitioner_id.in_(ids),
                    PractitionerShift.starts_at < end,
                    PractitionerShift.ends_at > start,
                )
                .order_by(PractitionerShift.starts_at)
            )
        )
        .scalars()
        .all()
    )
    legacy_range = (
        Booking.starts_at.is_(None)
        & (Booking.date >= (start - timedelta(days=1)).date().isoformat())
        & (Booking.date <= (end + timedelta(days=1)).date().isoformat())
    )
    bookings = list(
        (
            await db.execute(
                select(Booking).where(
                    Booking.status == "confirmed",
                    or_(
                        Booking.location_id == location_id,
                        Booking.practitioner_id.in_(ids),
                    ),
                    or_(
                        legacy_range,
                        (Booking.starts_at < end) & (Booking.ends_at > start),
                    ),
                )
            )
        )
        .scalars()
        .all()
    )
    return shifts, bookings


def available_practitioners(
    shifts, bookings, start, end, location_id, zone="UTC", first_only=False
):
    """Check complete intervals; a studio has one suite and cannot host overlaps."""
    blocked = set()
    local_date = start.astimezone(ZoneInfo(zone)).date().isoformat()
    for booking in bookings:
        if booking.starts_at is None:
            # Older reservations lack intervals, so reserve their entire local day.
            overlap = booking.date == local_date
        else:
            overlap = (
                as_utc(booking.starts_at) < end and as_utc(booking.ends_at) > start
            )
        if overlap:
            if booking.location_id == location_id:
                return []
            blocked.add(booking.practitioner_id)
    available = []
    for shift in shifts:
        shift_start = as_utc(shift.starts_at)
        shift_end = as_utc(shift.ends_at)
        if start < shift_start or end > shift_end:
            continue
        # Starts follow the inventory's 15-minute grid, anchored to each shift.
        if int((start - shift_start).total_seconds()) % (SLOT_MINUTES * 60):
            continue
        if shift.practitioner_id not in blocked:
            available.append(shift.practitioner_id)
            if first_only:
                return available
    return sorted(set(available))
