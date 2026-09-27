"""
Redband Atelier & Apothecary — FastAPI Backend
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import treatments, locations, practitioners, availability, bookings, dispatch


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed data on startup."""
    await init_db()
    yield


app = FastAPI(
    title="Redband Atelier API",
    description="Private restorative hair clinic and bespoke cutting room — reservation and data API.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend and mobile dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite frontend
        "http://localhost:8081",   # Expo mobile web
        "http://localhost:19006",  # Expo web
        "*",                      # Mobile native has no origin header
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(treatments.router)
app.include_router(locations.router)
app.include_router(practitioners.router)
app.include_router(availability.router)
app.include_router(bookings.router)
app.include_router(dispatch.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "Redband Atelier API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "healthy"}
