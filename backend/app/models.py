"""Database-backed business data. Legacy catalogs remain inactive until approved import."""

import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Treatment(Base):
    __tablename__ = "treatments"
    __table_args__ = (
        CheckConstraint("duration_minutes > 0 AND duration_minutes <= 720"),
        CheckConstraint("price_minor >= 0"),
        Index("ix_treatments_category", "category"),
    )
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    index: Mapped[str] = mapped_column(String(4))
    title: Mapped[str] = mapped_column(String(120))
    subtitle: Mapped[str] = mapped_column(String(255))
    duration: Mapped[str] = mapped_column(String(32))
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    price: Mapped[str] = mapped_column(String(32))
    numeric_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    price_minor: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    category: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    image_path: Mapped[str] = mapped_column(String(2048), default="")
    image_alt: Mapped[str] = mapped_column(String(255), default="")
    active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    formulations: Mapped[list["TreatmentFormulation"]] = relationship(
        back_populates="treatment",
        cascade="all, delete-orphan",
        order_by="TreatmentFormulation.id",
    )
    steps: Mapped[list["TreatmentStep"]] = relationship(
        back_populates="treatment",
        cascade="all, delete-orphan",
        order_by="TreatmentStep.order",
    )


class TreatmentFormulation(Base):
    __tablename__ = "treatment_formulations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    treatment_id: Mapped[str] = mapped_column(
        ForeignKey("treatments.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    treatment: Mapped["Treatment"] = relationship(back_populates="formulations")


class TreatmentStep(Base):
    __tablename__ = "treatment_steps"
    __table_args__ = (UniqueConstraint("treatment_id", "order"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    treatment_id: Mapped[str] = mapped_column(
        ForeignKey("treatments.id", ondelete="CASCADE"), index=True
    )
    order: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text)
    treatment: Mapped["Treatment"] = relationship(back_populates="steps")


class SignatureFavorite(Base):
    __tablename__ = "signature_favorites"
    __table_args__ = (
        CheckConstraint("duration_minutes >= 0 AND duration_minutes <= 720"),
        CheckConstraint("price_minor >= 0"),
    )
    code: Mapped[str] = mapped_column(String(16), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    duration: Mapped[str] = mapped_column(String(64))
    price: Mapped[str] = mapped_column(String(32))
    detail: Mapped[str] = mapped_column(Text)
    highlight: Mapped[str] = mapped_column(String(120))
    duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    price_minor: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)


class Practitioner(Base):
    __tablename__ = "practitioners"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    title: Mapped[str] = mapped_column(String(120))
    experience: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str] = mapped_column(String(255))
    avatar: Mapped[str] = mapped_column(String(4))
    active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    available_days: Mapped[list["PractitionerDay"]] = relationship(
        back_populates="practitioner",
        cascade="all, delete-orphan",
        order_by="PractitionerDay.id",
    )


class PractitionerDay(Base):
    __tablename__ = "practitioner_days"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    practitioner_id: Mapped[str] = mapped_column(
        ForeignKey("practitioners.id", ondelete="CASCADE"), index=True
    )
    day: Mapped[str] = mapped_column(String(8))
    practitioner: Mapped["Practitioner"] = relationship(back_populates="available_days")


class Location(Base):
    __tablename__ = "locations"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    city: Mapped[str] = mapped_column(String(64))
    neighborhood: Mapped[str] = mapped_column(String(64))
    address: Mapped[str] = mapped_column(String(255))
    transit: Mapped[str] = mapped_column(String(255))
    hours: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(32))
    accessibility: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(64))
    timezone: Mapped[str] = mapped_column(String(64), default="UTC")
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)


class PractitionerOffering(Base):
    __tablename__ = "practitioner_offerings"
    practitioner_id: Mapped[str] = mapped_column(
        ForeignKey("practitioners.id"), primary_key=True
    )
    location_id: Mapped[str] = mapped_column(
        ForeignKey("locations.id"), primary_key=True
    )
    treatment_id: Mapped[str] = mapped_column(
        ForeignKey("treatments.id"), primary_key=True
    )


class PractitionerShift(Base):
    __tablename__ = "practitioner_shifts"
    __table_args__ = (
        CheckConstraint("ends_at > starts_at"),
        Index("ix_shifts_location_range", "location_id", "starts_at", "ends_at"),
        UniqueConstraint("practitioner_id", "location_id", "starts_at", "ends_at"),
    )
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    practitioner_id: Mapped[str] = mapped_column(
        ForeignKey("practitioners.id"), index=True
    )
    location_id: Mapped[str] = mapped_column(ForeignKey("locations.id"))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


# Preserved legacy tables are deliberately not used as scheduling inventory.
class AvailableDate(Base):
    __tablename__ = "available_dates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(16))
    day_name: Mapped[str] = mapped_column(String(32))
    label: Mapped[str] = mapped_column(String(32))


class TimeSlot(Base):
    __tablename__ = "time_slots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    time: Mapped[str] = mapped_column(String(16))
    period: Mapped[str] = mapped_column(String(32))
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    reason: Mapped[str | None] = mapped_column(String(32), nullable=True)


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        Index("ix_bookings_slot", "location_id", "date", "time", "status"),
        Index("ix_bookings_guest_email", "guest_email"),
        Index("ix_bookings_created_at", "created_at"),
        Index(
            "ix_bookings_practitioner_range",
            "practitioner_id",
            "starts_at",
            "ends_at",
            "status",
        ),
        Index(
            "ix_bookings_location_range",
            "location_id",
            "starts_at",
            "ends_at",
            "status",
        ),
        CheckConstraint("status IN ('confirmed', 'cancelled', 'completed', 'no_show')"),
        CheckConstraint("ends_at IS NULL OR ends_at > starts_at"),
        CheckConstraint("total_price_minor >= 0"),
    )
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    reference: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    treatment_id: Mapped[str] = mapped_column(ForeignKey("treatments.id"))
    location_id: Mapped[str] = mapped_column(ForeignKey("locations.id"))
    practitioner_id: Mapped[str | None] = mapped_column(
        ForeignKey("practitioners.id"), nullable=True
    )
    date: Mapped[str] = mapped_column(String(16))
    time: Mapped[str] = mapped_column(String(16))
    starts_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    ends_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    total_price_minor: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    management_token_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    idempotency_key: Mapped[str | None] = mapped_column(
        String(128), nullable=True, unique=True
    )
    request_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    confirmation_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    firebase_uid: Mapped[str | None] = mapped_column(
        String(128), nullable=True, index=True
    )
    silent_chair: Mapped[bool] = mapped_column(Boolean, default=False)
    addon: Mapped[str | None] = mapped_column(String(120), nullable=True)
    guest_name: Mapped[str] = mapped_column(String(120))
    guest_email: Mapped[str] = mapped_column(String(255))
    guest_phone: Mapped[str] = mapped_column(String(32))
    guest_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(24), default="confirmed")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    cancelled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class DispatchSubscriber(Base):
    __tablename__ = "dispatch_subscribers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    subscribed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    confirmed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class ContentSection(Base):
    __tablename__ = "content_sections"
    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    data: Mapped[dict] = mapped_column(JSON)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    revision: Mapped[int] = mapped_column(Integer, default=1)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class DataRelease(Base):
    __tablename__ = "data_releases"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    approved_by: Mapped[str] = mapped_column(String(120))
    imported_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class RateLimitWindow(Base):
    __tablename__ = "rate_limit_windows"
    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    window: Mapped[int] = mapped_column(Integer, primary_key=True)
    hits: Mapped[int] = mapped_column(Integer)
