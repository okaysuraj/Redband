"""
POST /api/bookings — create a new reservation
GET  /api/bookings/{reference} — look up a booking by reference code
"""
import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Booking, Location, Practitioner, Treatment
from app.schemas import BookingConfirmation, BookingCreate, BookingOut

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


def _generate_reference() -> str:
    return f"RBD-{random.randint(100000, 999999)}"


@router.post("", response_model=BookingConfirmation, status_code=201)
async def create_booking(payload: BookingCreate, db: AsyncSession = Depends(get_db)):
    # Validate treatment exists
    treatment_result = await db.execute(
        select(Treatment).where(Treatment.id == payload.treatment_id)
    )
    treatment = treatment_result.scalar_one_or_none()
    if not treatment:
        raise HTTPException(status_code=400, detail="Invalid treatment_id")

    # Validate location exists
    location_result = await db.execute(
        select(Location).where(Location.id == payload.location_id)
    )
    location = location_result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=400, detail="Invalid location_id")

    # Resolve practitioner
    practitioner_name = "First Available Master Sculptor"
    prac_id = payload.practitioner_id
    if prac_id and prac_id != "any":
        prac_result = await db.execute(
            select(Practitioner).where(Practitioner.id == prac_id)
        )
        prac = prac_result.scalar_one_or_none()
        if not prac:
            raise HTTPException(status_code=400, detail="Invalid practitioner_id")
        practitioner_name = prac.name

    # Generate unique reference
    reference = _generate_reference()

    booking = Booking(
        reference=reference,
        treatment_id=payload.treatment_id,
        location_id=payload.location_id,
        practitioner_id=prac_id if prac_id != "any" else None,
        date=payload.date,
        time=payload.time,
        silent_chair=payload.silent_chair,
        addon=payload.addon,
        guest_name=payload.guest_name,
        guest_email=payload.guest_email,
        guest_phone=payload.guest_phone,
        guest_notes=payload.guest_notes,
    )
    db.add(booking)
    await db.flush()

    return BookingConfirmation(
        reference=reference,
        service=treatment.title,
        price=treatment.price,
        duration=treatment.duration,
        location=f"{location.city} Atelier ({location.neighborhood})",
        address=location.address,
        practitioner=practitioner_name,
        date=payload.date,
        time=payload.time,
        guest_name=payload.guest_name,
        guest_email=payload.guest_email,
        silent_chair=payload.silent_chair,
        addon=payload.addon,
        status="confirmed",
    )


@router.get("/{reference}", response_model=BookingOut)
async def get_booking(reference: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Booking).where(Booking.reference == reference.upper())
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
