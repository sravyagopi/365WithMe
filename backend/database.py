import os
import sqlite3
from contextlib import contextmanager

DATABASE = "365withme.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize database with tables and default data"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Categories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Goals table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
                target_value INTEGER DEFAULT 1,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        """)
        
        # CheckIns table - Event-based, multiple rows per goal per day allowed
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS checkins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                goal_id INTEGER NOT NULL,
                date DATE NOT NULL,
                value INTEGER DEFAULT 1 CHECK(value >= 0),
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
            )
        """)
        
        # Create index for faster date-based queries
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_checkins_date 
            ON checkins(date)
        """)
        
        # Create index for faster goal-based queries
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_checkins_goal_date 
            ON checkins(goal_id, date)
        """)
        
        # Insert default categories if empty
        cursor.execute("SELECT COUNT(*) FROM categories")
        if cursor.fetchone()[0] == 0:
            default_categories = [
                "Fitness", "Personal Growth", "Financial", 
                "Relationships", "Community", "Self-Care"
            ]
            cursor.executemany(
                "INSERT INTO categories (title) VALUES (?)",
                [(cat,) for cat in default_categories]
            )
        
        conn.commit()

def reset_db(remove_file: bool = True):
    """Remove existing sqlite DB file (if present) and recreate tables.

    This is safer than dropping tables via SQL for SQLite and preserves
    the same initialization logic in `init_db()`.
    """
    db_path = DATABASE
    if remove_file and os.path.exists(db_path):
        os.remove(db_path)
    init_db()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Initialize or reset the sqlite database.")
    parser.add_argument("--reset", action="store_true", help="Delete DB file and recreate tables")
    args = parser.parse_args()

    if args.reset:
        reset_db()
        print(f"Database reset at: {DATABASE}")
    else:
        init_db()
        print(f"Database initialized at: {DATABASE}")
