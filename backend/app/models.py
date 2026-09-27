"""
SQLAlchemy ORM models for Redband Atelier.
"""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def generate_uuid() -> str:
    return str(uuid.uuid4())


# ─── Treatments ────────────────────────────────────────────────────────────────

class Treatment(Base):
    __tablename__ = "treatments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    index: Mapped[str] = mapped_column(String(4))
    title: Mapped[str] = mapped_column(String(120))
    subtitle: Mapped[str] = mapped_column(String(255))
    duration: Mapped[str] = mapped_column(String(32))
    price: Mapped[str] = mapped_column(String(16))
    numeric_price: Mapped[float] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    image_path: Mapped[str] = mapped_column(String(255), default="")
    image_alt: Mapped[str] = mapped_column(String(255), default="")

    formulations: Mapped[list["TreatmentFormulation"]] = relationship(
        back_populates="treatment", cascade="all, delete-orphan"
    )
    steps: Mapped[list["TreatmentStep"]] = relationship(
        back_populates="treatment", cascade="all, delete-orphan", order_by="TreatmentStep.order"
    )


class TreatmentFormulation(Base):
    __tablename__ = "treatment_formulations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    treatment_id: Mapped[str] = mapped_column(ForeignKey("treatments.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))

    treatment: Mapped["Treatment"] = relationship(back_populates="formulations")


class TreatmentStep(Base):
    __tablename__ = "treatment_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    treatment_id: Mapped[str] = mapped_column(ForeignKey("treatments.id", ondelete="CASCADE"))
    order: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text)

    treatment: Mapped["Treatment"] = relationship(back_populates="steps")


# ─── Signature Favorites (Apothecary Add-ons) ─────────────────────────────────

class SignatureFavorite(Base):
    __tablename__ = "signature_favorites"

    code: Mapped[str] = mapped_column(String(16), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    duration: Mapped[str] = mapped_column(String(64))
    price: Mapped[str] = mapped_column(String(16))
    detail: Mapped[str] = mapped_column(Text)
    highlight: Mapped[str] = mapped_column(String(120))


# ─── Practitioners ─────────────────────────────────────────────────────────────

class Practitioner(Base):
    __tablename__ = "practitioners"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    title: Mapped[str] = mapped_column(String(120))
    experience: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str] = mapped_column(String(255))
    avatar: Mapped[str] = mapped_column(String(4))

    available_days: Mapped[list["PractitionerDay"]] = relationship(
        back_populates="practitioner", cascade="all, delete-orphan"
    )


class PractitionerDay(Base):
    __tablename__ = "practitioner_days"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    practitioner_id: Mapped[str] = mapped_column(ForeignKey("practitioners.id", ondelete="CASCADE"))
    day: Mapped[str] = mapped_column(String(8))

    practitioner: Mapped["Practitioner"] = relationship(back_populates="available_days")


# ─── Locations ─────────────────────────────────────────────────────────────────

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


# ─── Availability ──────────────────────────────────────────────────────────────

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


# ─── Bookings ──────────────────────────────────────────────────────────────────

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    treatment_id: Mapped[str] = mapped_column(ForeignKey("treatments.id"))
    location_id: Mapped[str] = mapped_column(ForeignKey("locations.id"))
    practitioner_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    date: Mapped[str] = mapped_column(String(16))
    time: Mapped[str] = mapped_column(String(16))
    silent_chair: Mapped[bool] = mapped_column(Boolean, default=False)
    addon: Mapped[str | None] = mapped_column(String(120), nullable=True)
    guest_name: Mapped[str] = mapped_column(String(120))
    guest_email: Mapped[str] = mapped_column(String(255))
    guest_phone: Mapped[str] = mapped_column(String(32))
    guest_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(24), default="confirmed")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ─── Newsletter Dispatch ──────────────────────────────────────────────────────

class DispatchSubscriber(Base):
    __tablename__ = "dispatch_subscribers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    subscribed_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
