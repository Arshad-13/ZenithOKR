"""Idempotent helper to add `version_id` column and weightage CHECK constraint.

Run on the deployment host where `DATABASE_URL` is set (do NOT commit secrets).

Usage:
    python backend/scripts/add_version_column.py
"""
import os
from sqlalchemy import create_engine, inspect, text


def main():
    db_url = os.getenv("DATABASE_URL") or os.getenv("DATABASE_URL_SQLITE") or os.getenv("DATABASE_URL_CONN")
    if not db_url:
        print("ERROR: DATABASE_URL environment variable not set. Exiting.")
        return

    engine = create_engine(db_url)
    insp = inspect(engine)

    if "goals" not in insp.get_table_names():
        print("No 'goals' table found in the database.")
        return

    cols = [c["name"] for c in insp.get_columns("goals")]
    with engine.begin() as conn:
        if "version_id" not in cols:
            print("Adding 'version_id' column with default=1 ...")
            conn.execute(text("ALTER TABLE goals ADD COLUMN version_id integer NOT NULL DEFAULT 1"))
        else:
            print("'version_id' column already exists.")

        # Add check constraint if not present
        constraints = [c["name"] for c in insp.get_check_constraints("goals")]
        if "ck_goal_weightage_range" not in constraints:
            print("Adding check constraint 'ck_goal_weightage_range' ...")
            conn.execute(text("ALTER TABLE goals ADD CONSTRAINT ck_goal_weightage_range CHECK (weightage >= 0 AND weightage <= 100)"))
        else:
            print("Check constraint already exists.")

    print("Done. If you use Alembic, create a proper migration thereafter.")


if __name__ == "__main__":
    main()
