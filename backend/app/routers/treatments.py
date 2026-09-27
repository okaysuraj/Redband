"""
GET /api/treatments — list all treatments
GET /api/treatments/{treatment_id} — single treatment detail
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Treatment
from app.schemas import TreatmentOut

router = APIRouter(prefix="/api/treatments", tags=["Treatments"])


def _treatment_to_out(t: Treatment) -> TreatmentOut:
    return TreatmentOut(
        id=t.id,
        index=t.index,
        title=t.title,
        subtitle=t.subtitle,
        duration=t.duration,
        price=t.price,
        numeric_price=t.numeric_price,
        category=t.category,
        description=t.description,
        image_path=t.image_path,
        image_alt=t.image_alt,
        formulations=[f.name for f in t.formulations],
        steps=[s.description for s in sorted(t.steps, key=lambda s: s.order)],
    )


@router.get("", response_model=list[TreatmentOut])
async def list_treatments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Treatment)
        .options(selectinload(Treatment.formulations), selectinload(Treatment.steps))
        .order_by(Treatment.index)
    )
    treatments = result.scalars().all()
    return [_treatment_to_out(t) for t in treatments]


@router.get("/{treatment_id}", response_model=TreatmentOut)
async def get_treatment(treatment_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Treatment)
        .where(Treatment.id == treatment_id)
        .options(selectinload(Treatment.formulations), selectinload(Treatment.steps))
    )
    treatment = result.scalar_one_or_none()
    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")
    return _treatment_to_out(treatment)
