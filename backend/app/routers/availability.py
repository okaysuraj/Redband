"""
GET /api/availability — returns dates + time slots
GET /api/availability/favorites — signature apothecary favorites
"""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import AvailableDate, SignatureFavorite, TimeSlot
from app.schemas import AvailabilityOut, AvailableDateOut, SignatureFavoriteOut, TimeSlotOut

router = APIRouter(prefix="/api/availability", tags=["Availability"])


@router.get("", response_model=AvailabilityOut)
async def get_availability(db: AsyncSession = Depends(get_db)):
    dates_result = await db.execute(select(AvailableDate))
    slots_result = await db.execute(select(TimeSlot))
    return AvailabilityOut(
        dates=[AvailableDateOut.model_validate(d) for d in dates_result.scalars().all()],
        time_slots=[TimeSlotOut.model_validate(s) for s in slots_result.scalars().all()],
    )


@router.get("/favorites", response_model=list[SignatureFavoriteOut])
async def list_signature_favorites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SignatureFavorite))
    return result.scalars().all()
