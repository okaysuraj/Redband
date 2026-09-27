"""
Seeds the database with the same curated data used on the web & mobile frontends.
Runs once during startup — skips seeding if data already exists.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    AvailableDate,
    Location,
    Practitioner,
    PractitionerDay,
    SignatureFavorite,
    TimeSlot,
    Treatment,
    TreatmentFormulation,
    TreatmentStep,
)


TREATMENTS_DATA = [
    {
        "id": "architectural-cut",
        "index": "01",
        "title": "The Architectural Cut",
        "subtitle": "Bone-structure mapping & dry scissor finish",
        "duration": "55 min",
        "price": "$95",
        "numeric_price": 95,
        "category": "Precision Sculpting",
        "description": (
            "A quiet, diagnostic session beginning with anatomical head-mapping and dry analysis. "
            "Tailored weight removal and scissor-over-comb detailing designed to grow out effortlessly "
            "for 8 to 10 weeks."
        ),
        "image_path": "/images/hero-portrait.jpg",
        "image_alt": "Documentary portrait of client post-treatment at Redband",
        "formulations": ["Wild Cedar Finishing Mist", "Cold-Pressed Jojoba Tonic"],
        "steps": [
            "Diagnostic structural consultation (10 min)",
            "Clarifying botanical wash with bergamot & hinoki (15 min)",
            "Anatomical dry cut & weight distribution (25 min)",
            "Cold-towel compress & matte texture finish (5 min)",
        ],
    },
    {
        "id": "botanical-scalp-ritual",
        "index": "02",
        "title": "Botanical Scalp & Follicle Ritual",
        "subtitle": "Micro-circulation, herbal steam & meridian massage",
        "duration": "70 min",
        "price": "$145",
        "numeric_price": 145,
        "category": "Restorative Apothecary",
        "description": (
            "A clinical trichology treatment combining rosemary-infused scalp oil, low-pressure "
            "ozone herbal steam, and targeted occipital pressure-point massage to oxygenate roots "
            "and reverse urban environmental stress."
        ),
        "image_path": "/images/apothecary-ritual.jpg",
        "image_alt": "Artisanal amber dropper bottles and botanical scalp oils",
        "formulations": [
            "Artisanal Scalp Elixir No. 3",
            "Rosemary & Blue Chamomile Steam",
            "Cold-Filtered Birch Sap",
        ],
        "steps": [
            "Micro-camera trichological scalp assessment (10 min)",
            "Custom botanical oil infusion & warm stone massage (25 min)",
            "Deep ultrasonic ozone steam vapor bath (20 min)",
            "Rinse with iced green tea infusion & light blowout (15 min)",
        ],
    },
    {
        "id": "texture-mastery-session",
        "index": "03",
        "title": "Texture Mastery & Movement",
        "subtitle": "Pattern hydration, curl geometry & weight liberation",
        "duration": "85 min",
        "price": "$175",
        "numeric_price": 175,
        "category": "Curvature & Pattern",
        "description": (
            "Engineered specifically for curls, waves, coils, and heavy straight hair that requires "
            "internal movement. We carve negative space into the hair architecture while infusing "
            "bio-lipid moisture."
        ),
        "image_path": "/images/craft-tools.jpg",
        "image_alt": "Handcrafted matte black shears and horn comb on travertine",
        "formulations": ["Meadowfoam Seed Emulsion", "Raw Murumuru Butter", "Yuzu Hydrosol"],
        "steps": [
            "Dry silhouette consultation in natural state (15 min)",
            "Targeted curl-by-curl architectural carve (35 min)",
            "Deep moisture-locking mask under infrared heat (20 min)",
            "Natural diffuser set with zero heat damage (15 min)",
        ],
    },
    {
        "id": "complete-restoration",
        "index": "04",
        "title": "The Atelier Restoration Suite",
        "subtitle": "Cut, complete scalp reset, and apothecary prescription",
        "duration": "115 min",
        "price": "$235",
        "numeric_price": 235,
        "category": "Full Atelier Experience",
        "description": (
            "The definitive Redband experience. Unhurried, single-chair privacy covering full "
            "structural haircutting, therapeutic follicle rejuvenation, and a personalized 30-day "
            "apothecary maintenance bottle compounded on site."
        ),
        "image_path": "/images/studio-interior.jpg",
        "image_alt": "Quiet monolithic travertine basin and minimalist studio",
        "formulations": [
            "Custom Blended Follicle Serum",
            "Smoked Vetiver Scalp Butter",
            "Pure Rain Hydrosol",
        ],
        "steps": [
            "Comprehensive consultation with Master Practitioner (15 min)",
            "Thermal scalp purification & therapeutic meridian ritual (40 min)",
            "Complete bespoke architectural cut & shape refinement (45 min)",
            "Personalized apothecary blend compounding & takeaway bottle (15 min)",
        ],
    },
]

SIGNATURE_FAVORITES_DATA = [
    {
        "code": "RF-01",
        "name": "Occipital Tension Release",
        "duration": "30 min add-on",
        "price": "$55",
        "detail": "Targeted sub-occipital cranial pressure points with warm cypress oil.",
        "highlight": "Booked by 78% of repeat clients",
    },
    {
        "code": "RF-02",
        "name": "Seasonal Apothecary Prescriptive",
        "duration": "Single flask compounding",
        "price": "$68",
        "detail": "A customized 100ml dropper bottle formulated to match your scalp pH and urban climate.",
        "highlight": "Small batch · 40 flasks per week",
    },
    {
        "code": "RF-03",
        "name": "The Silent Chair Session",
        "duration": "Complimentary option",
        "price": "$0",
        "detail": (
            "Zero conversation after initial consultation. Acoustic calm, warm tea, "
            "and pure restorative silence."
        ),
        "highlight": "Available for all treatments",
    },
]

PRACTITIONERS_DATA = [
    {
        "id": "elena-vane",
        "name": "Elena Vane",
        "title": "Atelier Director & Master Sculptor",
        "experience": "14 yrs craft · Former Vidal Sassoon London Creative Educator",
        "specialty": "Architectural precision, dry-cutting, structural grow-out balance",
        "avatar": "EV",
        "days": ["Wed", "Thu", "Fri", "Sat"],
    },
    {
        "id": "marcus-thorne",
        "name": "Marcus Thorne",
        "title": "Senior Trichology & Scalp Artisan",
        "experience": "11 yrs craft · Certified Clinical Scalp Specialist",
        "specialty": "Follicle restoration, botanical compounding, meridian pressure massage",
        "avatar": "MT",
        "days": ["Mon", "Tue", "Thu", "Fri"],
    },
    {
        "id": "sora-kato",
        "name": "Sora Kato",
        "title": "Master Texture & Geometry Specialist",
        "experience": "9 yrs craft · Tokyo & Paris Atelier background",
        "specialty": "Natural curl movement, dry carving, effortless non-heat styling",
        "avatar": "SK",
        "days": ["Tue", "Wed", "Fri", "Sat", "Sun"],
    },
]

LOCATIONS_DATA = [
    {
        "id": "noho-nyc",
        "city": "New York",
        "neighborhood": "NoHo / Bowery",
        "address": "312 Lafayette Street, 3rd Floor",
        "transit": "B, D, F, M at Broadway-Lafayette · 6 at Bleecker",
        "hours": "Tuesday – Saturday: 9:00 AM – 7:30 PM",
        "phone": "+1 (212) 844-9120",
        "accessibility": "Elevator access, step-free entrance, sensory-calm private suite",
        "status": "Chairs Open Today",
    },
    {
        "id": "mayfair-ldn",
        "city": "London",
        "neighborhood": "Mayfair",
        "address": "14 Bourdon Street, Ground Floor",
        "transit": "Bond Street & Green Park Stations (5 min walk)",
        "hours": "Monday – Friday: 8:30 AM – 7:00 PM · Sat: 10:00 AM – 6:00 PM",
        "phone": "+44 (0)20 7946 0882",
        "accessibility": "Street-level entrance, tactile acoustic dampening",
        "status": "Limited Slots This Week",
    },
]

DATES_DATA = [
    {"date": "2026-09-17", "day_name": "Thu, Sep 17", "label": "Tomorrow"},
    {"date": "2026-09-18", "day_name": "Fri, Sep 18", "label": "Friday"},
    {"date": "2026-09-19", "day_name": "Sat, Sep 19", "label": "Saturday"},
    {"date": "2026-09-22", "day_name": "Tue, Sep 22", "label": "Next Tuesday"},
    {"date": "2026-09-23", "day_name": "Wed, Sep 23", "label": "Next Wednesday"},
]

SLOTS_DATA = [
    {"time": "09:30 AM", "period": "Morning", "available": True, "reason": None},
    {"time": "11:00 AM", "period": "Morning", "available": True, "reason": None},
    {"time": "01:30 PM", "period": "Afternoon", "available": False, "reason": "Reserved"},
    {"time": "03:00 PM", "period": "Afternoon", "available": True, "reason": None},
    {"time": "04:45 PM", "period": "Late Afternoon", "available": True, "reason": None},
    {"time": "06:15 PM", "period": "Evening", "available": True, "reason": None},
]


async def seed_defaults():
    """Insert default data if the treatments table is empty."""
    from app.database import async_session

    async with async_session() as session:
        result = await session.execute(select(Treatment).limit(1))
        if result.scalar_one_or_none() is not None:
            return  # Already seeded

        # Treatments
        for td in TREATMENTS_DATA:
            treatment = Treatment(
                id=td["id"],
                index=td["index"],
                title=td["title"],
                subtitle=td["subtitle"],
                duration=td["duration"],
                price=td["price"],
                numeric_price=td["numeric_price"],
                category=td["category"],
                description=td["description"],
                image_path=td["image_path"],
                image_alt=td["image_alt"],
            )
            session.add(treatment)
            for f_name in td["formulations"]:
                session.add(TreatmentFormulation(treatment_id=td["id"], name=f_name))
            for i, step in enumerate(td["steps"]):
                session.add(TreatmentStep(treatment_id=td["id"], order=i + 1, description=step))

        # Signature Favorites
        for sf in SIGNATURE_FAVORITES_DATA:
            session.add(SignatureFavorite(**sf))

        # Practitioners
        for pd in PRACTITIONERS_DATA:
            practitioner = Practitioner(
                id=pd["id"],
                name=pd["name"],
                title=pd["title"],
                experience=pd["experience"],
                specialty=pd["specialty"],
                avatar=pd["avatar"],
            )
            session.add(practitioner)
            for day in pd["days"]:
                session.add(PractitionerDay(practitioner_id=pd["id"], day=day))

        # Locations
        for loc in LOCATIONS_DATA:
            session.add(Location(**loc))

        # Dates & Slots
        for d in DATES_DATA:
            session.add(AvailableDate(**d))
        for s in SLOTS_DATA:
            session.add(TimeSlot(**s))

        await session.commit()
