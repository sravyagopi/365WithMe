from database import get_db
from models import CheckIn, CheckInCreate
from typing import List, Optional
from datetime import date, datetime

class CheckInRepository:
    @staticmethod
    def get_by_date(check_date: str) -> List[dict]:
        """Get all check-ins for a specific date"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, goal_id, date, value, note, created_at
                FROM checkins
                WHERE date = ?
                ORDER BY created_at DESC
            """, (check_date,))
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_goal(goal_id: int, start_date: Optional[str] = None, 
                    end_date: Optional[str] = None) -> List[dict]:
        """Get check-ins for a specific goal within optional date range"""
        with get_db() as conn:
            cursor = conn.cursor()
            query = """
                SELECT id, goal_id, date, value, note, created_at
                FROM checkins
                WHERE goal_id = ?
            """
            params = [goal_id]
            
            if start_date:
                query += " AND date >= ?"
                params.append(start_date)
            if end_date:
                query += " AND date <= ?"
                params.append(end_date)
            
            query += " ORDER BY date DESC, created_at DESC"
            cursor.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_by_date_range(start_date: str, end_date: str) -> List[dict]:
        """Get all check-ins within a date range"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, goal_id, date, value, note, created_at
                FROM checkins
                WHERE date BETWEEN ? AND ?
                ORDER BY date DESC, created_at DESC
            """, (start_date, end_date))
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def create(checkin: CheckInCreate) -> dict:
        """Always insert a new check-in event (no update logic)"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO checkins (goal_id, date, value, note)
                VALUES (?, ?, ?, ?)
            """, (checkin.goal_id, checkin.date, checkin.value, checkin.note))
            conn.commit()
            
            checkin_id = cursor.lastrowid
            return {
                "id": checkin_id,
                "goal_id": checkin.goal_id,
                "date": checkin.date,
                "value": checkin.value,
                "note": checkin.note,
                "created_at": datetime.now().isoformat()
            }
    
    @staticmethod
    def delete(checkin_id: int) -> bool:
        """Delete a specific check-in event"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM checkins WHERE id = ?", (checkin_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    @staticmethod
    def get_year_summary(year: int) -> dict:
        """Get check-in count for each day of the year"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT date, COUNT(*) as count
                FROM checkins
                WHERE strftime('%Y', date) = ?
                GROUP BY date
                ORDER BY date
            """, (str(year),))
            
            result = {}
            for row in cursor.fetchall():
                result[row[0]] = row[1]
            return result
    
    @staticmethod
    def get_progress_in_window(goal_id: int, start_date: str, end_date: str) -> int:
        """Calculate total progress (sum of values) for a goal in a time window"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT COALESCE(SUM(value), 0) as total
                FROM checkins
                WHERE goal_id = ? AND date BETWEEN ? AND ?
            """, (goal_id, start_date, end_date))
            return cursor.fetchone()[0]
    
    @staticmethod
    def get_all_progress_in_window(start_date: str, end_date: str) -> dict:
        """Get progress for all goals in a time window"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT goal_id, SUM(value) as total
                FROM checkins
                WHERE date BETWEEN ? AND ?
                GROUP BY goal_id
            """, (start_date, end_date))
            
            result = {}
            for row in cursor.fetchall():
                result[row[0]] = row[1]
            return result