"""Authenticated reservations with atomic, duration-aware resource allocation."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking_service import reserve_booking
from app.database import get_db
from app.firebase_auth import AuthUser, require_user
from app.models import Booking
from app.scheduling import as_utc
from app.schemas import (
    BookingCancelResponse,
    BookingConfirmation,
    BookingCreate,
    BookingOut,
)
from app.security import rate_limit, require_admin

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])
admin_router = APIRouter(
    prefix="/api/admin/bookings",
    tags=["Operator bookings"],
    dependencies=[Depends(require_admin)],
)


@router.post(
    "",
    response_model=BookingConfirmation,
    status_code=201,
    dependencies=[Depends(rate_limit("booking-create", 10, authenticated=True))],
)
async def create_booking(
    payload: BookingCreate,
    user: AuthUser = Depends(require_user),
    idempotency_key: str | None = Header(default=None, max_length=128),
    db: AsyncSession = Depends(get_db),
):
    return await reserve_booking(payload, user, idempotency_key, db)


@router.get(
    "",
    response_model=list[BookingOut],
    dependencies=[Depends(rate_limit("booking-read", 60, authenticated=True))],
)
async def my_bookings(
    user: AuthUser = Depends(require_user),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0, le=10000),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking)
        .where(Booking.firebase_uid == user.uid)
        .order_by(Booking.created_at.desc(), Booking.id)
        .offset(offset)
        .limit(limit)
    )
    return [_booking_out(b) for b in result.scalars().all()]


def _booking_out(booking):
    out = BookingOut.model_validate(booking)
    # Normalize legacy timestamps and database timestamps to UTC.
    if out.starts_at:
        out.starts_at = as_utc(out.starts_at)
    if out.ends_at:
        out.ends_at = as_utc(out.ends_at)
    out.created_at = as_utc(out.created_at)
    return out


async def owned_booking(reference, user, db):
    booking = (
        await db.execute(
            select(Booking).where(
                Booking.reference == reference.upper(), Booking.firebase_uid == user.uid
            )
        )
    ).scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Reservation not found")
    return booking


@router.get(
    "/{reference}",
    response_model=BookingOut,
    dependencies=[Depends(rate_limit("booking-read", 60, authenticated=True))],
)
async def get_booking(
    reference: str,
    user: AuthUser = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    return _booking_out(await owned_booking(reference, user, db))


@router.delete(
    "/{reference}",
    response_model=BookingCancelResponse,
    dependencies=[Depends(rate_limit("booking-cancel", 20, authenticated=True))],
)
async def cancel_booking(
    reference: str,
    user: AuthUser = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    booking = await owned_booking(reference, user, db)
    if booking.status == "cancelled":
        return BookingCancelResponse(
            reference=booking.reference,
            status="cancelled",
            message="Reservation is already cancelled.",
        )
    if booking.status != "confirmed" or (
        booking.starts_at and as_utc(booking.starts_at) <= datetime.now(timezone.utc)
    ):
        raise HTTPException(
            409, "This reservation cannot be cancelled online. Contact the studio."
        )
    booking.status = "cancelled"
    booking.cancelled_at = datetime.now(timezone.utc)
    await db.commit()
    return BookingCancelResponse(
        reference=booking.reference,
        status="cancelled",
        message="Reservation cancelled.",
    )


@admin_router.get("", response_model=list[BookingOut])
async def list_bookings(
    location_id: str | None = Query(default=None, max_length=64),
    date: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0, le=10000),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Booking)
        .order_by(Booking.created_at.desc(), Booking.id)
        .limit(limit)
        .offset(offset)
    )
    if location_id:
        query = query.where(Booking.location_id == location_id)
    if date:
        query = query.where(Booking.date == date)
    return [_booking_out(b) for b in (await db.execute(query)).scalars().all()]
