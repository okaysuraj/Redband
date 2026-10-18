"""Redband API: catalog, shared content, and authenticated reservations.

From backend/: alembic upgrade head, then uvicorn app.main:app --reload.
Load approved catalog content explicitly with python -m app.import_data <file>.
"""

import os
from contextlib import asynccontextmanager
from urllib.parse import urlsplit

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from starlette.responses import JSONResponse

from app.database import APP_ENV, engine, init_db
from app.middleware import RequestGuardMiddleware
from app.routers import (
    availability,
    bookings,
    content,
    dispatch,
    health,
    locations,
    practitioners,
    treatments,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if APP_ENV == "production" and len(os.getenv("ADMIN_API_KEY", "")) < 32:
        raise RuntimeError(
            "Production ADMIN_API_KEY must contain at least 32 characters"
        )
    await init_db()
    yield
    await engine.dispose()


app = FastAPI(
    title="Redband Atelier API",
    version="2.0.0",
    lifespan=lifespan,
    docs_url=None if APP_ENV == "production" else "/docs",
    redoc_url=None if APP_ENV == "production" else "/redoc",
    openapi_url=None if APP_ENV == "production" else "/openapi.json",
)

origins = [
    x.strip().rstrip("/") for x in os.getenv("CORS_ORIGINS", "").split(",") if x.strip()
]
if not origins and APP_ENV != "production":
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ]
if APP_ENV == "production" and (
    not origins
    or any(
        urlsplit(x).scheme != "https" or not urlsplit(x).netloc or urlsplit(x).path
        for x in origins
    )
):
    raise RuntimeError("Production CORS_ORIGINS requires explicit HTTPS origins")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Booking-Token",
        "Idempotency-Key",
    ],
    max_age=600,
)

app.add_middleware(RequestGuardMiddleware)
for router in (
    health.router,
    treatments.router,
    locations.router,
    practitioners.router,
    availability.router,
    bookings.router,
    bookings.admin_router,
    dispatch.router,
    content.router,
):
    app.include_router(router)


@app.exception_handler(SQLAlchemyError)
async def database_error(request, exc):
    # Never expose SQL, credentials or customer values in error payloads.
    return JSONResponse(
        {"detail": "The service is temporarily unavailable. Please try again."},
        status_code=503,
    )


@app.get("/")
async def root():
    return {"service": "Redband Atelier API", "version": "2.0.0"}
