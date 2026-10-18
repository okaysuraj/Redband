"""
GET /api/practitioners — list all practitioners
GET /api/practitioners/{practitioner_id} — single practitioner detail
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Practitioner
from app.schemas import PractitionerOut

router = APIRouter(prefix="/api/practitioners", tags=["Practitioners"])


def _practitioner_to_out(p: Practitioner) -> PractitionerOut:
    return PractitionerOut(
        id=p.id,
        name=p.name,
        title=p.title,
        experience=p.experience,
        specialty=p.specialty,
        avatar=p.avatar,
        days=[d.day for d in p.available_days],
    )


@router.get("", response_model=list[PractitionerOut])
async def list_practitioners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Practitioner)
        .where(Practitioner.active.is_(True))
        .options(selectinload(Practitioner.available_days))
        .order_by(Practitioner.id)
    )
    practitioners = result.scalars().all()
    return [_practitioner_to_out(p) for p in practitioners]


@router.get("/{practitioner_id}", response_model=PractitionerOut)
async def get_practitioner(practitioner_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Practitioner)
        .where(Practitioner.id == practitioner_id, Practitioner.active.is_(True))
        .options(selectinload(Practitioner.available_days))
    )
    practitioner = result.scalar_one_or_none()
    if not practitioner:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    return _practitioner_to_out(practitioner)
