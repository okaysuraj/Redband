"""Liveness and deployment readiness, without exposing connection details."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from app.content_schema import REQUIRED_SECTIONS
from app.database import get_db
from app.firebase_auth import firebase_ready
from app.models import (
    ContentSection,
    DataRelease,
    Location,
    Practitioner,
    PractitionerOffering,
    PractitionerShift,
    Treatment,
)

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {"status": "healthy"}


@router.get("/ready")
async def readiness(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    released = (
        await db.execute(select(DataRelease.id).limit(1))
    ).scalar_one_or_none() is not None
    keys = set(
        (
            await db.execute(
                select(ContentSection.key).where(ContentSection.published.is_(True))
            )
        )
        .scalars()
        .all()
    )
    counts = {}
    for name, cls in [
        ("treatments", Treatment),
        ("locations", Location),
        ("practitioners", Practitioner),
    ]:
        counts[name] = (
            await db.execute(
                select(func.count()).select_from(cls).where(cls.active.is_(True))
            )
        ).scalar_one()
    offerings = (
        await db.execute(select(func.count()).select_from(PractitionerOffering))
    ).scalar_one()
    shifts = (
        await db.execute(
            select(func.count())
            .select_from(PractitionerShift)
            .where(PractitionerShift.ends_at > datetime.now(timezone.utc))
        )
    ).scalar_one()
    configured = firebase_ready()
    ready = (
        released
        and not (REQUIRED_SECTIONS - keys)
        and all(counts.values())
        and offerings > 0
        and shifts > 0
        and configured
    )
    status = {
        "status": "ready" if ready else "not_ready",
        "database": True,
        "approved_release": released,
        "content_complete": not bool(REQUIRED_SECTIONS - keys),
        "catalog_complete": all(counts.values()) and offerings > 0,
        "schedule_available": shifts > 0,
        "firebase_configured": configured,
    }
    return JSONResponse(status, status_code=200 if ready else 503)
