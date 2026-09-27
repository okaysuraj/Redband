"""
POST /api/dispatch/subscribe — subscribe an email to the Atelier Dispatch journal
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import DispatchSubscriber
from app.schemas import DispatchSubscribeRequest, DispatchSubscribeResponse

router = APIRouter(prefix="/api/dispatch", tags=["Dispatch"])


@router.post("/subscribe", response_model=DispatchSubscribeResponse, status_code=201)
async def subscribe_dispatch(
    payload: DispatchSubscribeRequest, db: AsyncSession = Depends(get_db)
):
    email = payload.email.strip().lower()

    # Check if already subscribed
    result = await db.execute(
        select(DispatchSubscriber).where(DispatchSubscriber.email == email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="This email is already on our quarterly journal list.",
        )

    subscriber = DispatchSubscriber(email=email)
    db.add(subscriber)
    await db.flush()

    return DispatchSubscribeResponse(
        message="Your address has been entered into our quarterly journal list.",
        email=email,
    )
