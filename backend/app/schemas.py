"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ─── Treatment Schemas ─────────────────────────────────────────────────────────

class TreatmentOut(BaseModel):
    id: str
    index: str
    title: str
    subtitle: str
    duration: str
    price: str
    numeric_price: float
    category: str
    description: str
    image_path: str
    image_alt: str
    formulations: list[str]
    steps: list[str]

    model_config = {"from_attributes": True}


# ─── Signature Favorite Schemas ────────────────────────────────────────────────

class SignatureFavoriteOut(BaseModel):
    code: str
    name: str
    duration: str
    price: str
    detail: str
    highlight: str

    model_config = {"from_attributes": True}


# ─── Practitioner Schemas ──────────────────────────────────────────────────────

class PractitionerOut(BaseModel):
    id: str
    name: str
    title: str
    experience: str
    specialty: str
    avatar: str
    days: list[str]

    model_config = {"from_attributes": True}


# ─── Location Schemas ─────────────────────────────────────────────────────────

class LocationOut(BaseModel):
    id: str
    city: str
    neighborhood: str
    address: str
    transit: str
    hours: str
    phone: str
    accessibility: str
    status: str

    model_config = {"from_attributes": True}


# ─── Availability Schemas ──────────────────────────────────────────────────────

class AvailableDateOut(BaseModel):
    date: str
    day_name: str
    label: str

    model_config = {"from_attributes": True}


class TimeSlotOut(BaseModel):
    time: str
    period: str
    available: bool
    reason: str | None = None

    model_config = {"from_attributes": True}


class AvailabilityOut(BaseModel):
    dates: list[AvailableDateOut]
    time_slots: list[TimeSlotOut]


# ─── Booking Schemas ───────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    treatment_id: str
    location_id: str
    practitioner_id: str | None = "any"
    date: str
    time: str
    silent_chair: bool = False
    addon: str | None = None
    guest_name: str = Field(..., min_length=1, max_length=120)
    guest_email: str = Field(..., min_length=5, max_length=255)
    guest_phone: str = Field(..., min_length=5, max_length=32)
    guest_notes: str | None = None


class BookingOut(BaseModel):
    id: str
    reference: str
    treatment_id: str
    location_id: str
    practitioner_id: str | None
    date: str
    time: str
    silent_chair: bool
    addon: str | None
    guest_name: str
    guest_email: str
    guest_phone: str
    guest_notes: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingConfirmation(BaseModel):
    """Returned after a successful booking — includes resolved details."""
    reference: str
    service: str
    price: str
    duration: str
    location: str
    address: str
    practitioner: str
    date: str
    time: str
    guest_name: str
    guest_email: str
    silent_chair: bool
    addon: str | None
    status: str


# ─── Dispatch Schemas ──────────────────────────────────────────────────────────

class DispatchSubscribeRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)


class DispatchSubscribeResponse(BaseModel):
    message: str
    email: str
