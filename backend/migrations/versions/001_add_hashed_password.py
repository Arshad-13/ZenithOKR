"""add hashed_password to users

Revision ID: 001_add_hashed_password
Revises: a1b2c3d4e5f6
Create Date: 2026-05-17
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_add_hashed_password'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if column already exists to prevent duplicate error
    # We will simply execute the add_column statement
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'hashed_password')
