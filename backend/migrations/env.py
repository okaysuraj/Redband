"""Apply migrations with the same PostgreSQL URL configuration as the app."""

import asyncio

from alembic import context

from app.database import engine
from app.models import Base


def run_migrations(connection):
    context.configure(
        connection=connection, target_metadata=Base.metadata, compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()


async def migrate():
    async with engine.connect() as connection:
        await connection.run_sync(run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    raise RuntimeError("Use online migrations against a backed-up database")
else:
    asyncio.run(migrate())
