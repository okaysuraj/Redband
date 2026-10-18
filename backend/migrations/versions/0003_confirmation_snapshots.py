"""Immutable reservation details and safe same-request replay.

Revision ID: 0003
"""

import sqlalchemy as sa
from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = depends_on = None


def upgrade():
    op.add_column(
        "bookings", sa.Column("confirmation_snapshot", sa.JSON, nullable=True)
    )


def downgrade():
    raise RuntimeError(
        "Rollback is intentionally non-destructive; restore a verified backup instead"
    )
