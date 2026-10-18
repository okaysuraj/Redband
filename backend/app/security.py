"""Constant-time operator auth and bounded, cross-worker database rate limits."""

import hashlib
import os
import secrets
import time

from fastapi import Depends, Header, HTTPException, Request
from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert

from app.database import async_session
from app.firebase_auth import AuthUser, require_user
from app.models import RateLimitWindow


def token_hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def is_admin(authorization: str | None) -> bool:
    configured = os.getenv("ADMIN_API_KEY", "")
    return bool(
        configured
        and authorization
        and secrets.compare_digest(authorization, "Bearer " + configured)
    )


async def require_admin(authorization: str | None = Header(default=None)):
    if not is_admin(authorization):
        raise HTTPException(
            401,
            "Operator authorization required",
            headers={"WWW-Authenticate": "Bearer"},
        )


def rate_limit(bucket: str, limit: int, seconds: int = 60, authenticated: bool = False):
    async def consume(request: Request, user: AuthUser | None = None):
        # Proxy forwarding is handled only by uvicorn's trusted proxy configuration.
        identity = (
            user.uid if user else (request.client.host if request.client else "unknown")
        )
        key = token_hash(bucket + ":" + identity)
        window = int(time.time()) // seconds
        async with async_session() as session:
            statement = insert(RateLimitWindow).values(key=key, window=window, hits=1)
            statement = statement.on_conflict_do_update(
                index_elements=["key", "window"],
                set_={"hits": RateLimitWindow.hits + 1},
            ).returning(RateLimitWindow.hits)
            hits = (await session.execute(statement)).scalar_one()
            # Expired rows never accumulate indefinitely, even with many unique IPs.
            await session.execute(
                delete(RateLimitWindow).where(RateLimitWindow.window < window - 2)
            )
            await session.commit()
        if hits > limit:
            raise HTTPException(
                429,
                "Too many requests. Please try again shortly.",
                headers={"Retry-After": str(seconds)},
            )

    if authenticated:

        async def enforce_user(
            request: Request, user: AuthUser = Depends(require_user)
        ):
            await consume(request, user)

        return enforce_user

    async def enforce_ip(request: Request):
        await consume(request)

    return enforce_ip
