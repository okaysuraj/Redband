"""One published editorial source for both clients."""

from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, ConfigDict, ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.content_schema import SECTION_MODELS, validate_section
from app.database import get_db
from app.models import ContentSection
from app.security import require_admin

router = APIRouter(tags=["Content"])


class PublishSection(BaseModel):
    model_config = ConfigDict(extra="forbid")
    data: dict
    published: bool = False


@router.get("/api/content")
async def content(db: AsyncSession = Depends(get_db)):
    rows = (
        (
            await db.execute(
                select(ContentSection)
                .where(ContentSection.published.is_(True))
                .order_by(ContentSection.key)
            )
        )
        .scalars()
        .all()
    )
    return {"version": 1, "sections": {row.key: row.data for row in rows}}


@router.put("/api/admin/content/{key}", dependencies=[Depends(require_admin)])
async def publish_section(
    payload: PublishSection,
    key: str = Path(max_length=64),
    db: AsyncSession = Depends(get_db),
):
    try:
        data = validate_section(key, payload.data)
    except (ValueError, ValidationError):
        raise HTTPException(
            422, "Content does not match the shared editorial schema"
        ) from None
    row = await db.get(ContentSection, key)
    if row is None:
        row = ContentSection(key=key, data=data, published=payload.published)
        db.add(row)
    else:
        row.data, row.published = data, payload.published
        row.revision += 1
    await db.commit()
    return {"key": key, "published": row.published, "revision": row.revision}


@router.get("/api/admin/content-schema", dependencies=[Depends(require_admin)])
async def content_schema():
    return {key: model.model_json_schema() for key, model in SECTION_MODELS.items()}
