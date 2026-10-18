"""Adopt the original schema without inserting sample records.

Revision ID: 0001
"""

import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = depends_on = None


def upgrade():
    tables = set(sa.inspect(op.get_bind()).get_table_names())
    if "treatments" in tables:
        required = {
            "treatments",
            "treatment_formulations",
            "treatment_steps",
            "signature_favorites",
            "practitioners",
            "practitioner_days",
            "locations",
            "available_dates",
            "time_slots",
            "bookings",
            "dispatch_subscribers",
        }
        if required - tables:
            raise RuntimeError(
                "Partial legacy schema requires manual review before migration"
            )
        return
    op.create_table(
        "treatments",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("index", sa.String(4), nullable=False),
        sa.Column("title", sa.String(120), nullable=False),
        sa.Column("subtitle", sa.String(255), nullable=False),
        sa.Column("duration", sa.String(32), nullable=False),
        sa.Column("price", sa.String(32), nullable=False),
        sa.Column("numeric_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("image_path", sa.String(2048), nullable=False),
        sa.Column("image_alt", sa.String(255), nullable=False),
    )
    op.create_table(
        "treatment_formulations",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "treatment_id",
            sa.String(64),
            sa.ForeignKey("treatments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=False),
    )
    op.create_table(
        "treatment_steps",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "treatment_id",
            sa.String(64),
            sa.ForeignKey("treatments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("order", sa.Integer, nullable=False),
        sa.Column("description", sa.Text, nullable=False),
    )
    op.create_table(
        "signature_favorites",
        sa.Column("code", sa.String(16), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("duration", sa.String(64), nullable=False),
        sa.Column("price", sa.String(32), nullable=False),
        sa.Column("detail", sa.Text, nullable=False),
        sa.Column("highlight", sa.String(120), nullable=False),
    )
    op.create_table(
        "practitioners",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("title", sa.String(120), nullable=False),
        sa.Column("experience", sa.String(255), nullable=False),
        sa.Column("specialty", sa.String(255), nullable=False),
        sa.Column("avatar", sa.String(4), nullable=False),
    )
    op.create_table(
        "practitioner_days",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "practitioner_id",
            sa.String(64),
            sa.ForeignKey("practitioners.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("day", sa.String(8), nullable=False),
    )
    op.create_table(
        "locations",
        sa.Column("id", sa.String(64), primary_key=True),
        *[
            sa.Column(name, sa.String(size), nullable=False)
            for name, size in [
                ("city", 64),
                ("neighborhood", 64),
                ("address", 255),
                ("transit", 255),
                ("hours", 255),
                ("phone", 32),
                ("accessibility", 255),
                ("status", 64),
            ]
        ],
    )
    op.create_table(
        "available_dates",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("date", sa.String(16), nullable=False),
        sa.Column("day_name", sa.String(32), nullable=False),
        sa.Column("label", sa.String(32), nullable=False),
    )
    op.create_table(
        "time_slots",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("time", sa.String(16), nullable=False),
        sa.Column("period", sa.String(32), nullable=False),
        sa.Column("available", sa.Boolean, nullable=False),
        sa.Column("reason", sa.String(32)),
    )
    op.create_table(
        "bookings",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("reference", sa.String(32), nullable=False, unique=True),
        sa.Column(
            "treatment_id",
            sa.String(64),
            sa.ForeignKey("treatments.id"),
            nullable=False,
        ),
        sa.Column(
            "location_id", sa.String(64), sa.ForeignKey("locations.id"), nullable=False
        ),
        sa.Column("practitioner_id", sa.String(64)),
        sa.Column("date", sa.String(16), nullable=False),
        sa.Column("time", sa.String(16), nullable=False),
        sa.Column("silent_chair", sa.Boolean, nullable=False),
        sa.Column("addon", sa.String(120)),
        sa.Column("guest_name", sa.String(120), nullable=False),
        sa.Column("guest_email", sa.String(255), nullable=False),
        sa.Column("guest_phone", sa.String(32), nullable=False),
        sa.Column("guest_notes", sa.Text),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_table(
        "dispatch_subscribers",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column(
            "subscribed_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade():
    raise RuntimeError(
        "Rollback is intentionally non-destructive; restore a verified backup instead"
    )
