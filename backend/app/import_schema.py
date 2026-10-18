"""Validate a complete catalog release before opening a publication transaction."""

from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.content_schema import REQUIRED_SECTIONS, validate_image, validate_sections

Id = Annotated[str, Field(pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$")]
Currency = Literal["USD", "GBP", "EUR", "INR", "AUD", "CAD", "NZD", "SGD", "AED"]
Short = Annotated[str, Field(max_length=255)]
Long = Annotated[str, Field(max_length=12000)]


class ImportModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class TreatmentInput(ImportModel):
    id: Id
    index: str = Field(max_length=4)
    title: str = Field(min_length=1, max_length=120)
    subtitle: Short
    duration_minutes: int = Field(gt=0, le=720)
    price_minor: int = Field(ge=0, le=100000000)
    currency: Currency
    category: str = Field(min_length=1, max_length=80)
    description: Long
    image_path: str = ""
    image_alt: Short = ""
    formulations: list[Short] = Field(default_factory=list, max_length=100)
    steps: list[Long] = Field(default_factory=list, max_length=100)
    _image = field_validator("image_path")(validate_image)


class LocationInput(ImportModel):
    id: Id
    city: str = Field(min_length=1, max_length=64)
    neighborhood: str = Field(max_length=64)
    address: Short
    transit: Short
    hours: Short
    phone: str = Field(max_length=32)
    accessibility: Short
    status: str = Field(max_length=64)
    timezone: str = Field(max_length=64)
    currency: Currency

    @field_validator("timezone")
    @classmethod
    def valid_zone(cls, value):
        try:
            ZoneInfo(value)
        except ZoneInfoNotFoundError:
            raise ValueError("An IANA location timezone is required") from None
        return value


class PractitionerInput(ImportModel):
    id: Id
    name: str = Field(min_length=1, max_length=80)
    title: str = Field(max_length=120)
    experience: Short
    specialty: Short
    avatar: str = Field(max_length=4)
    days: list[Literal["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]] = Field(
        default_factory=list, max_length=7
    )


class FavoriteInput(ImportModel):
    code: str = Field(min_length=1, max_length=16, pattern=r"^[a-zA-Z0-9_-]+$")
    name: str = Field(min_length=1, max_length=120)
    duration: str = Field(max_length=64)
    detail: Long
    highlight: str = Field(max_length=120)
    duration_minutes: int = Field(ge=0, le=720)
    price_minor: int = Field(ge=0, le=100000000)
    currency: Currency


class OfferingInput(ImportModel):
    practitioner_id: Id
    location_id: Id
    treatment_id: Id


class ShiftInput(ImportModel):
    practitioner_id: Id
    location_id: Id
    starts_at: datetime
    ends_at: datetime

    @model_validator(mode="after")
    def valid_interval(self):
        if self.starts_at.tzinfo is None or self.ends_at.tzinfo is None:
            raise ValueError("Shift times require UTC offsets")
        self.starts_at = self.starts_at.astimezone(timezone.utc)
        self.ends_at = self.ends_at.astimezone(timezone.utc)
        if not timedelta() < self.ends_at - self.starts_at <= timedelta(hours=24):
            raise ValueError("Shift interval must be positive and at most 24 hours")
        if any(x.second or x.microsecond for x in [self.starts_at, self.ends_at]):
            raise ValueError("Shift times must use whole minutes")
        return self


class BusinessImport(ImportModel):
    release_id: Id
    approved_by: str = Field(min_length=1, max_length=120)
    treatments: list[TreatmentInput] = Field(min_length=1, max_length=300)
    locations: list[LocationInput] = Field(min_length=1, max_length=100)
    practitioners: list[PractitionerInput] = Field(min_length=1, max_length=1000)
    favorites: list[FavoriteInput] = Field(default_factory=list, max_length=300)
    offerings: list[OfferingInput] = Field(min_length=1, max_length=10000)
    shifts: list[ShiftInput] = Field(min_length=1, max_length=10000)
    sections: dict[str, dict]

    @model_validator(mode="after")
    def consistent(self):
        for rows, attr in [
            (self.treatments, "id"),
            (self.locations, "id"),
            (self.practitioners, "id"),
            (self.favorites, "code"),
        ]:
            if len({getattr(x, attr) for x in rows}) != len(rows):
                raise ValueError("Duplicate catalog identifiers")
        treatment = {x.id: x for x in self.treatments}
        locations = {x.id: x for x in self.locations}
        practitioners = {x.id: x for x in self.practitioners}
        offering_keys = set()
        for row in self.offerings:
            if (
                row.treatment_id not in treatment
                or row.location_id not in locations
                or row.practitioner_id not in practitioners
            ):
                raise ValueError("Offering refers to a missing catalog record")
            if (
                treatment[row.treatment_id].currency
                != locations[row.location_id].currency
            ):
                raise ValueError("Offering treatment/location currencies differ")
            key = (row.practitioner_id, row.location_id, row.treatment_id)
            if key in offering_keys:
                raise ValueError("Duplicate offering")
            offering_keys.add(key)
        # Index once: a release can contain ten thousand offerings and shifts.
        offered_pairs = {
            (practitioner_id, location_id)
            for practitioner_id, location_id, _ in offering_keys
        }
        for row in self.shifts:
            if (row.practitioner_id, row.location_id) not in offered_pairs:
                raise ValueError("Shift has no approved practitioner/location offering")
        intervals = sorted(self.shifts, key=lambda x: (x.practitioner_id, x.starts_at))
        for previous, current in zip(intervals, intervals[1:]):
            if (
                previous.practitioner_id == current.practitioner_id
                and current.starts_at < previous.ends_at
            ):
                raise ValueError("A practitioner cannot have overlapping shifts")
        self.sections = validate_sections(self.sections)
        if REQUIRED_SECTIONS - self.sections.keys():
            raise ValueError("All shared editorial sections must be supplied")
        if not self.sections["brand"].get("name") or not self.sections["hero"].get(
            "title"
        ):
            raise ValueError("Approved brand name and hero title are required")
        if not all(
            self.sections["legal"].get(key, {}).get("body")
            for key in ("privacy", "terms", "accessibility")
        ):
            raise ValueError(
                "Approved privacy, terms and accessibility content is required"
            )
        return self
