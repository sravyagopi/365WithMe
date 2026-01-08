from database import get_db
from models import User, UserCreate
from auth import hash_password, verify_password
from typing import List, Optional
import sqlite3

class UserRepository:
    @staticmethod
    def get_by_id(user_id: int) -> Optional[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, username, created_at
                FROM users WHERE id = ?
            """, (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    @staticmethod
    def get_by_username(username: str) -> Optional[dict]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, username, password_hash, created_at
                FROM users WHERE username = ?
            """, (username,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    @staticmethod
    def create(user: UserCreate) -> dict:
        """Create a new user and seed default categories with user_id"""
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if username already exists
            cursor.execute("SELECT id FROM users WHERE username = ?", (user.username,))
            if cursor.fetchone():
                raise ValueError("Username already taken")
            
            # Create user
            password_hash = hash_password(user.password)
            cursor.execute("""
                INSERT INTO users (username, password_hash)
                VALUES (?, ?)
            """, (user.username, password_hash))
            user_id = cursor.lastrowid
            
            # Seed default categories for new user - WITH user_id
            default_categories = [
                "Fitness", "Personal Growth", "Financial", 
                "Relationships", "Community", "Self-Care"
            ]
            for category_title in default_categories:
                cursor.execute("""
                    INSERT INTO categories (user_id, title) VALUES (?, ?)
                """, (user_id, category_title))
            
            conn.commit()
            
            return UserRepository.get_by_id(user_id)
    
    @staticmethod
    def authenticate(username: str, password: str) -> Optional[dict]:
        """Authenticate user and return user data if valid"""
        user = UserRepository.get_by_username(username)
        if not user:
            return None
        
        if not verify_password(password, user['password_hash']):
            return None
        
        # Remove password_hash from response
        del user['password_hash']
        return user