"""
Pydantic schemas for request/response validation.
"""

import re
from datetime import date as Date
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

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
    duration_minutes: int
    price_minor: int
    currency: str

    model_config = {"from_attributes": True}


# ─── Signature Favorite Schemas ────────────────────────────────────────────────


class SignatureFavoriteOut(BaseModel):
    code: str
    name: str
    duration: str
    price: str
    detail: str
    highlight: str
    duration_minutes: int
    price_minor: int
    currency: str

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
    timezone: str
    currency: str

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
    model_config = {"extra": "forbid", "str_strip_whitespace": True}
    treatment_id: str = Field(min_length=1, max_length=64)
    location_id: str = Field(min_length=1, max_length=64)
    practitioner_id: str | None = Field(default="any", max_length=64)
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: str = Field(pattern=r"^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$")
    silent_chair: bool = False
    addon: str | None = Field(default=None, max_length=120)
    guest_name: str = Field(..., min_length=1, max_length=120)
    guest_email: EmailStr = Field(..., max_length=255)
    guest_phone: str = Field(..., min_length=5, max_length=32)
    guest_notes: str | None = Field(default=None, max_length=2000)

    @field_validator("date")
    @classmethod
    def valid_date(cls, value):
        Date.fromisoformat(value)
        return value

    @field_validator("guest_phone")
    @classmethod
    def valid_phone(cls, value):
        if (
            not re.fullmatch(r"\+?[\d ()\-\.]{5,32}", value)
            or not 7 <= len(re.sub(r"\D", "", value)) <= 15
        ):
            raise ValueError("Enter a phone number with 7 to 15 digits")
        return value

    @field_validator("guest_email")
    @classmethod
    def normalized_email(cls, value):
        return value.lower()


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
    starts_at: datetime | None
    ends_at: datetime | None
    total_price_minor: int
    currency: str
    confirmation_snapshot: dict | None = None

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
    management_token: str | None = None
    starts_at: datetime
    ends_at: datetime
    total_price_minor: int
    currency: str


class BookingCancelResponse(BaseModel):
    reference: str
    status: str
    message: str


# ─── Dispatch Schemas ──────────────────────────────────────────────────────────


class DispatchSubscribeRequest(BaseModel):
    model_config = {"extra": "forbid", "str_strip_whitespace": True}
    email: EmailStr = Field(..., max_length=255)


class DispatchSubscribeResponse(BaseModel):
    message: str
    email: str
