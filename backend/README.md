# Redband Atelier — FastAPI Backend

Private restorative hair clinic and bespoke cutting room API powering the Redband web and mobile frontends.

## Tech Stack

- **Framework**: FastAPI 0.141
- **ORM**: SQLAlchemy 2.1 (async)
- **Database**: SQLite via aiosqlite (zero-config dev DB)
- **Validation**: Pydantic v2
- **Server**: Uvicorn with hot reload

## Quick Start

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run the dev server
uvicorn app.main:app --reload --port 8000
```

The API is live at **http://localhost:8000** — interactive docs at **http://localhost:8000/docs**.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Service info and status |
| `GET` | `/health` | Health check |
| `GET` | `/api/treatments` | List all 4 curated treatment disciplines |
| `GET` | `/api/treatments/{id}` | Single treatment with formulations & ritual steps |
| `GET` | `/api/locations` | Studio sanctuaries (NoHo NYC, Mayfair London) |
| `GET` | `/api/locations/{id}` | Single location detail |
| `GET` | `/api/practitioners` | Master sculptors & artisans |
| `GET` | `/api/practitioners/{id}` | Single practitioner profile |
| `GET` | `/api/availability` | Available dates & time slots |
| `GET` | `/api/availability/favorites` | Signature apothecary add-ons (RF-01 to RF-03) |
| `POST` | `/api/bookings` | Create a private suite reservation |
| `GET` | `/api/bookings/{reference}` | Look up booking by reference code (RBD-XXXXXX) |
| `POST` | `/api/dispatch/subscribe` | Subscribe email to the Atelier Dispatch journal |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app, CORS, lifespan, router mounts
│   ├── database.py       # Async engine, session factory, init_db
│   ├── models.py         # SQLAlchemy ORM models (11 tables)
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── seed.py           # Auto-seeds curated data on first launch
│   └── routers/
│       ├── __init__.py
│       ├── treatments.py
│       ├── locations.py
│       ├── practitioners.py
│       ├── availability.py
│       ├── bookings.py
│       └── dispatch.py
├── requirements.txt
├── venv/
└── README.md
```

## Database

On first startup, the app automatically creates `redband.db` (SQLite) and seeds it with:

- **4 treatments** with formulations and ritual step sequences
- **3 signature favorites** (RF-01, RF-02, RF-03)
- **3 master practitioners** with schedule days
- **2 studio locations** (NoHo NYC, Mayfair London)
- **5 available dates** and **6 time slots**

The SQLite file is gitignored — delete it to fully re-seed.
