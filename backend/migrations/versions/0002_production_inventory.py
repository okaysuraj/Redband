"""Approved publishing, UTC inventory, money snapshots and booking privacy.

Revision ID: 0002
"""

import sqlalchemy as sa
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = depends_on = None


def upgrade():
    bind = op.get_bind()
    for table in ("treatments", "signature_favorites", "practitioners", "locations"):
        op.add_column(
            table,
            sa.Column("active", sa.Boolean, nullable=False, server_default=sa.false()),
        )
        op.create_index(f"ix_{table}_active", table, ["active"])
    for table, duration in [("treatments", 60), ("signature_favorites", 0)]:
        op.add_column(
            table,
            sa.Column(
                "duration_minutes",
                sa.Integer,
                nullable=False,
                server_default=str(duration),
            ),
        )
        op.add_column(
            table,
            sa.Column("price_minor", sa.Integer, nullable=False, server_default="0"),
        )
        op.add_column(
            table,
            sa.Column("currency", sa.String(3), nullable=False, server_default="USD"),
        )
    op.add_column(
        "locations",
        sa.Column("timezone", sa.String(64), nullable=False, server_default="UTC"),
    )
    op.add_column(
        "locations",
        sa.Column("currency", sa.String(3), nullable=False, server_default="USD"),
    )
    for name in ("starts_at", "ends_at", "cancelled_at"):
        op.add_column("bookings", sa.Column(name, sa.DateTime(timezone=True)))
    for name, size in [
        ("management_token_hash", 64),
        ("idempotency_key", 128),
        ("request_hash", 64),
        ("firebase_uid", 128),
    ]:
        op.add_column("bookings", sa.Column(name, sa.String(size)))
    op.add_column(
        "bookings",
        sa.Column("total_price_minor", sa.Integer, nullable=False, server_default="0"),
    )
    op.add_column(
        "bookings",
        sa.Column("currency", sa.String(3), nullable=False, server_default="USD"),
    )
    op.add_column(
        "dispatch_subscribers", sa.Column("confirmed_at", sa.DateTime(timezone=True))
    )
    op.create_table(
        "practitioner_offerings",
        sa.Column(
            "practitioner_id",
            sa.String(64),
            sa.ForeignKey("practitioners.id"),
            primary_key=True,
        ),
        sa.Column(
            "location_id",
            sa.String(64),
            sa.ForeignKey("locations.id"),
            primary_key=True,
        ),
        sa.Column(
            "treatment_id",
            sa.String(64),
            sa.ForeignKey("treatments.id"),
            primary_key=True,
        ),
    )
    op.create_table(
        "practitioner_shifts",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "practitioner_id",
            sa.String(64),
            sa.ForeignKey("practitioners.id"),
            nullable=False,
        ),
        sa.Column(
            "location_id", sa.String(64), sa.ForeignKey("locations.id"), nullable=False
        ),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("ends_at > starts_at", name="ck_shift_interval"),
        sa.UniqueConstraint(
            "practitioner_id",
            "location_id",
            "starts_at",
            "ends_at",
            name="uq_shift_interval",
        ),
    )
    op.create_table(
        "content_sections",
        sa.Column("key", sa.String(64), primary_key=True),
        sa.Column("data", sa.JSON, nullable=False),
        sa.Column("published", sa.Boolean, nullable=False),
        sa.Column("revision", sa.Integer, nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_table(
        "data_releases",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("approved_by", sa.String(120), nullable=False),
        sa.Column(
            "imported_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_table(
        "rate_limit_windows",
        sa.Column("key", sa.String(64), primary_key=True),
        sa.Column("window", sa.Integer, primary_key=True),
        sa.Column("hits", sa.Integer, nullable=False),
    )
    indexes = [
        ("ix_treatments_category", "treatments", ["category"]),
        (
            "ix_treatment_formulations_treatment_id",
            "treatment_formulations",
            ["treatment_id"],
        ),
        ("ix_treatment_steps_treatment_id", "treatment_steps", ["treatment_id"]),
        (
            "ix_practitioner_days_practitioner_id",
            "practitioner_days",
            ["practitioner_id"],
        ),
        (
            "ix_practitioner_shifts_practitioner_id",
            "practitioner_shifts",
            ["practitioner_id"],
        ),
        (
            "ix_shifts_location_range",
            "practitioner_shifts",
            ["location_id", "starts_at", "ends_at"],
        ),
        ("ix_bookings_slot", "bookings", ["location_id", "date", "time", "status"]),
        ("ix_bookings_guest_email", "bookings", ["guest_email"]),
        ("ix_bookings_created_at", "bookings", ["created_at"]),
        ("ix_bookings_reference", "bookings", ["reference"]),
        ("ix_bookings_firebase_uid", "bookings", ["firebase_uid"]),
        (
            "ix_bookings_practitioner_range",
            "bookings",
            ["practitioner_id", "starts_at", "ends_at", "status"],
        ),
        (
            "ix_bookings_location_range",
            "bookings",
            ["location_id", "starts_at", "ends_at", "status"],
        ),
        ("ix_dispatch_subscribers_email", "dispatch_subscribers", ["email"]),
    ]
    for name, table, columns in indexes:
        if name not in {x["name"] for x in sa.inspect(bind).get_indexes(table)}:
            op.create_index(name, table, columns)
    op.create_index(
        "uq_bookings_idempotency_key", "bookings", ["idempotency_key"], unique=True
    )
    op.alter_column("bookings", "reference", type_=sa.String(32))
    op.alter_column("treatments", "price", type_=sa.String(32))
    op.alter_column("signature_favorites", "price", type_=sa.String(32))
    op.alter_column("treatments", "image_path", type_=sa.String(2048))
    op.alter_column(
        "treatments",
        "numeric_price",
        type_=sa.Numeric(12, 2),
        postgresql_using="numeric_price::numeric(12,2)",
    )
    op.execute(
        "ALTER TABLE bookings ADD CONSTRAINT fk_booking_practitioner FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) NOT VALID"
    )
    for table, name, condition in [
        (
            "bookings",
            "ck_booking_status",
            "status IN ('confirmed','cancelled','completed','no_show')",
        ),
        (
            "bookings",
            "ck_booking_interval",
            "ends_at IS NULL OR ends_at > starts_at",
        ),
        ("bookings", "ck_booking_price", "total_price_minor >= 0"),
        (
            "treatments",
            "ck_treatment_duration",
            "duration_minutes > 0 AND duration_minutes <= 720",
        ),
        ("treatments", "ck_treatment_price", "price_minor >= 0"),
        (
            "signature_favorites",
            "ck_favorite_duration",
            "duration_minutes >= 0 AND duration_minutes <= 720",
        ),
        ("signature_favorites", "ck_favorite_price", "price_minor >= 0"),
    ]:
        op.execute(
            f"ALTER TABLE {table} ADD CONSTRAINT {name} CHECK ({condition}) NOT VALID"
        )
    # btree_gist must be permitted for the migration role (supported by Neon).
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
    for resource in ("location_id", "practitioner_id"):
        op.execute(
            f"ALTER TABLE bookings ADD CONSTRAINT exclude_booking_{resource} EXCLUDE USING gist ({resource} WITH =, tstzrange(starts_at,ends_at,'[)') WITH &&) WHERE (status = 'confirmed' AND starts_at IS NOT NULL AND ends_at IS NOT NULL)"
        )


def downgrade():
    raise RuntimeError(
        "Rollback is intentionally non-destructive; restore a verified backup instead"
    )
