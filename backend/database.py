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
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Categories table - NOW WITH user_id
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Goals table - NOW WITH user_id
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
                target_value INTEGER DEFAULT 1,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        """)
        
        # CheckIns table - NOW WITH user_id
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS checkins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                goal_id INTEGER NOT NULL,
                date DATE NOT NULL,
                value INTEGER DEFAULT 1 CHECK(value >= 0),
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
            )
        """)
        
        # Create indexes for performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_checkins_user ON checkins(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_checkins_goal_date ON checkins(goal_id, date)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        
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
