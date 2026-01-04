from database import get_db
from models import Goal, GoalCreate, GoalUpdate
from typing import List, Optional

class GoalRepository:
    @staticmethod
    def get_all(include_inactive: bool = False) -> List[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            query = """
                SELECT id, title, category_id, frequency, target_value, is_active
                FROM goals
            """
            if not include_inactive:
                query += " WHERE is_active = 1"
            query += " ORDER BY created_at DESC"
            
            cursor.execute(query)
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_id(goal_id: int) -> Optional[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, title, category_id, frequency, target_value, is_active
                FROM goals WHERE id = ?
            """, (goal_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    @staticmethod
    def get_by_category(category_id: int) -> List[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, title, category_id, frequency, target_value, is_active
                FROM goals
                WHERE category_id = ? AND is_active = 1
                ORDER BY created_at DESC
            """, (category_id,))
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_frequency(frequency: str, include_inactive: bool = False) -> List[dict]:
        """Get all goals with a specific frequency"""
        with get_db() as conn:
            cursor = conn.cursor()
            query = """
                SELECT id, title, category_id, frequency, target_value, is_active
                FROM goals
                WHERE frequency = ?
            """
            if not include_inactive:
                query += " AND is_active = 1"
            query += " ORDER BY created_at DESC"
            
            cursor.execute(query, (frequency,))
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def create(goal: GoalCreate) -> dict:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO goals (title, category_id, frequency, target_value)
                VALUES (?, ?, ?, ?)
            """, (goal.title, goal.category_id, goal.frequency, goal.target_value))
            conn.commit()
            return GoalRepository.get_by_id(cursor.lastrowid)
    
    @staticmethod
    def update(goal_id: int, goal: GoalUpdate) -> Optional[dict]:
        update_fields = []
        params = []
        
        if goal.title is not None:
            update_fields.append("title = ?")
            params.append(goal.title)
        if goal.category_id is not None:
            update_fields.append("category_id = ?")
            params.append(goal.category_id)
        if goal.frequency is not None:
            update_fields.append("frequency = ?")
            params.append(goal.frequency)
        if goal.target_value is not None:
            update_fields.append("target_value = ?")
            params.append(goal.target_value)
        if goal.is_active is not None:
            update_fields.append("is_active = ?")
            params.append(goal.is_active)
        
        if not update_fields:
            return GoalRepository.get_by_id(goal_id)
        
        params.append(goal_id)
        query = f"UPDATE goals SET {', '.join(update_fields)} WHERE id = ?"
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            if cursor.rowcount > 0:
                return GoalRepository.get_by_id(goal_id)
            return None
    
    @staticmethod
    def delete(goal_id: int) -> bool:
        """Soft delete - set is_active to 0"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE goals SET is_active = 0 WHERE id = ?", (goal_id,))
            conn.commit()
            return cursor.rowcount > 0

