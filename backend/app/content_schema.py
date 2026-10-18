"""Shared web/mobile editorial contract; validates operator-authored content."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, field_validator

Text = Annotated[str, Field(max_length=12000)]
ShortText = Annotated[str, Field(max_length=500)]
TextList = Annotated[list[Text], Field(max_length=100)]


class EditorialModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


def validate_image(value: str) -> str:
    if value and (not value.startswith("https://") or len(value) > 2048):
        raise ValueError("Published images require an absolute HTTPS URL")
    return value


class Stat(EditorialModel):
    label: ShortText
    value: ShortText


class TitleDescription(EditorialModel):
    title: ShortText
    description: Text


class Brand(EditorialModel):
    name: ShortText = ""
    subtitle: ShortText = ""
    description: Text = ""


class Hero(EditorialModel):
    eyebrow: ShortText = ""
    badge: ShortText = ""
    title: ShortText = ""
    subtitle: ShortText = ""
    description: Text = ""
    image_url: str = ""
    image_alt: ShortText = ""
    image_caption: ShortText = ""
    location_caption: ShortText = ""
    stats: list[Stat] = Field(default_factory=list, max_length=30)
    _image = field_validator("image_url")(validate_image)


class Quote(EditorialModel):
    text: Text
    author: ShortText
    role: ShortText = ""


class EditorialImage(EditorialModel):
    url: str
    alt: ShortText
    caption: ShortText = ""
    _image = field_validator("url")(validate_image)


class Story(EditorialModel):
    eyebrow: ShortText = ""
    title: ShortText = ""
    paragraphs: TextList = Field(default_factory=list)
    quote: Quote | None = None
    pillars: list[TitleDescription] = Field(default_factory=list, max_length=30)
    images: list[EditorialImage] = Field(default_factory=list, max_length=30)


class Ticker(EditorialModel):
    statements: TextList = Field(default_factory=list)


class TreatmentsEditorial(EditorialModel):
    title: ShortText = ""
    description: Text = ""
    note: Text = ""
    protocol_title: ShortText = ""
    protocol_description: Text = ""
    amenities: TextList = Field(default_factory=list)
    features: TextList = Field(default_factory=list)
    cancellation_note: Text = ""


class SectionIntro(EditorialModel):
    title: ShortText = ""
    description: Text = ""


class Footer(EditorialModel):
    dispatch_title: ShortText = ""
    dispatch_description: Text = ""
    dispatch_fineprint: Text = ""
    protocols: list[TitleDescription] = Field(default_factory=list, max_length=30)
    copyright: ShortText = ""


class LegalPage(EditorialModel):
    title: ShortText
    body: Text


class Legal(EditorialModel):
    privacy: LegalPage | None = None
    terms: LegalPage | None = None
    accessibility: LegalPage | None = None


SECTION_MODELS = {
    "brand": Brand,
    "hero": Hero,
    "story": Story,
    "ticker": Ticker,
    "treatments": TreatmentsEditorial,
    "favorites": SectionIntro,
    "studios": SectionIntro,
    "footer": Footer,
    "legal": Legal,
}
REQUIRED_SECTIONS = frozenset(SECTION_MODELS)


def validate_section(key: str, data: dict) -> dict:
    if key not in SECTION_MODELS:
        raise ValueError("Unknown editorial section")
    return (
        SECTION_MODELS[key]
        .model_validate(data)
        .model_dump(mode="json", exclude_unset=True)
    )


def validate_sections(sections: dict) -> dict:
    return {key: validate_section(key, value) for key, value in sections.items()}
