"""Persist subscription requests without claiming email delivery or confirmation."""

from fastapi import APIRouter, Depends
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import DispatchSubscriber
from app.schemas import DispatchSubscribeRequest, DispatchSubscribeResponse
from app.security import rate_limit

router = APIRouter(prefix="/api/dispatch", tags=["Dispatch"])


@router.post(
    "/subscribe",
    response_model=DispatchSubscribeResponse,
    status_code=201,
    dependencies=[Depends(rate_limit("dispatch", 5))],
)
async def subscribe_dispatch(
    payload: DispatchSubscribeRequest, db: AsyncSession = Depends(get_db)
):
    email = str(payload.email).strip().lower()
    await db.execute(
        insert(DispatchSubscriber)
        .values(email=email)
        .on_conflict_do_nothing(index_elements=["email"])
    )
    await db.commit()
    # Same response for existing and new addresses prevents membership enumeration.
    return DispatchSubscribeResponse(
        message="Your subscription request has been recorded.", email=email
    )
