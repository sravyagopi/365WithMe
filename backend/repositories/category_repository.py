from database import get_db
from models import Category, CategoryCreate, CategoryUpdate
from typing import List, Optional
import sqlite3

class CategoryRepository:
    @staticmethod
    def get_all(user_id: int) -> List[dict]:
        """Get all categories for a specific user"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, user_id, title, created_at 
                FROM categories 
                WHERE user_id = ?
                ORDER BY title
            """, (user_id,))
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_id(category_id: int, user_id: int) -> Optional[dict]:
        """Get category by id, ensuring it belongs to the user"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, user_id, title, created_at
                FROM categories 
                WHERE id = ? AND user_id = ?
            """, (category_id, user_id))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    @staticmethod
    def create(category: CategoryCreate, user_id: int) -> dict:
        """Create category for a specific user"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO categories (user_id, title) 
                VALUES (?, ?)
            """, (user_id, category.title))
            conn.commit()
            return CategoryRepository.get_by_id(cursor.lastrowid, user_id)
    
    @staticmethod
    def update(category_id: int, category: CategoryUpdate, user_id: int) -> Optional[dict]:
        """Update category, ensuring it belongs to the user"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE categories 
                SET title = ? 
                WHERE id = ? AND user_id = ?
            """, (category.title, category_id, user_id))
            conn.commit()
            if cursor.rowcount > 0:
                return CategoryRepository.get_by_id(category_id, user_id)
            return None
    
    @staticmethod
    def delete(category_id: int, user_id: int) -> bool:
        """Delete category, ensuring it belongs to the user"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM categories 
                WHERE id = ? AND user_id = ?
            """, (category_id, user_id))
            conn.commit()
            return cursor.rowcount > 0
