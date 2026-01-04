from database import get_db
from models import Category, CategoryCreate, CategoryUpdate
from typing import List, Optional
import sqlite3

class CategoryRepository:
    @staticmethod
    def get_all() -> List[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title FROM categories ORDER BY title")
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_id(category_id: int) -> Optional[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title FROM categories WHERE id = ?", (category_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    @staticmethod
    def create(category: CategoryCreate) -> dict:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO categories (title) VALUES (?)",
                (category.title,)
            )
            conn.commit()
            return {"id": cursor.lastrowid, "title": category.title}
    
    @staticmethod
    def update(category_id: int, category: CategoryUpdate) -> Optional[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE categories SET title = ? WHERE id = ?",
                (category.title, category_id)
            )
            conn.commit()
            if cursor.rowcount > 0:
                return CategoryRepository.get_by_id(category_id)
            return None
    
    @staticmethod
    def delete(category_id: int) -> bool:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
            conn.commit()
            return cursor.rowcount > 0

