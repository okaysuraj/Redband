"""
GET /api/locations — list all studio locations
GET /api/locations/{location_id} — single location detail
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Location
from app.schemas import LocationOut

router = APIRouter(prefix="/api/locations", tags=["Locations"])


@router.get("", response_model=list[LocationOut])
async def list_locations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location))
    return result.scalars().all()


@router.get("/{location_id}", response_model=LocationOut)
async def get_location(location_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location
