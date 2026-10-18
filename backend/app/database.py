"""PostgreSQL-only async database setup. Runtime never seeds business content."""

import os
import ssl
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.models import Base

APP_ENV = os.getenv("APP_ENV", "development").lower()
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
if not DATABASE_URL.startswith("postgresql+asyncpg://"):
    raise RuntimeError("DATABASE_URL must be set to a PostgreSQL connection URL")
engine_kwargs = {
    "echo": False,
    "pool_pre_ping": True,
    "pool_size": int(os.getenv("DB_POOL_SIZE", "5")),
    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "5")),
    "pool_recycle": 1800,
    "pool_timeout": 15,
}
# Neon provides libpq URLs; asyncpg takes an SSLContext rather than sslmode.
parts = urlsplit(DATABASE_URL)
query = dict(parse_qsl(parts.query))
mode = query.pop("sslmode", None)
query.pop(
    "channel_binding", None
)  # TLS certificate/hostname verification remains mandatory.
connect_args = {}
if APP_ENV == "production" or mode in {"require", "verify-ca", "verify-full"}:
    connect_args["ssl"] = ssl.create_default_context()
elif mode == "disable":
    connect_args["ssl"] = False
elif mode:
    raise RuntimeError(
        "Use sslmode=require, verify-full, verify-ca or development-only disable"
    )
if "-pooler" in (parts.hostname or ""):
    connect_args.update(statement_cache_size=0, prepared_statement_cache_size=0)
DATABASE_URL = urlunsplit(
    (parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)
)
engine_kwargs["connect_args"] = connect_args
engine = create_async_engine(DATABASE_URL, **engine_kwargs)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    auto_create = os.getenv("AUTO_CREATE_SCHEMA", "false").lower() == "true"
    if auto_create and APP_ENV == "production":
        raise RuntimeError("Run alembic upgrade head before production startup")
    if auto_create:
        async with engine.begin() as conn:
            tables = await conn.run_sync(lambda c: inspect(c).get_table_names())
            if tables and "content_sections" not in tables:
                raise RuntimeError(
                    "Legacy schema detected; back up the database and run alembic upgrade head"
                )
            await conn.run_sync(Base.metadata.create_all)
    async with engine.connect() as conn:
        columns = await conn.run_sync(
            lambda c: {x["name"] for x in inspect(c).get_columns("bookings")}
        )
        if {"management_token_hash", "firebase_uid", "confirmation_snapshot"} - columns:
            raise RuntimeError("Database migrations are required: alembic upgrade head")
        if not auto_create:
            revision = (
                await conn.execute(text("SELECT version_num FROM alembic_version"))
            ).scalar_one()
            if revision != "0003":
                raise RuntimeError(
                    "Database migrations are required: alembic upgrade head"
                )
