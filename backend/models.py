from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib

# Category Models
class CategoryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Goal Models
class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category_id: int
    frequency: str = Field(..., pattern="^(daily|weekly|monthly|yearly|custom)$")
    target_value: int = Field(default=1, ge=1)  # Changed from target_per_period

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category_id: Optional[int] = None
    frequency: Optional[str] = Field(None, pattern="^(daily|weekly|monthly|yearly|custom)$")
    target_value: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None

class Goal(GoalBase):
    id: int
    is_active: bool = True
    
    class Config:
        from_attributes = True

# CheckIn Models
class CheckInBase(BaseModel):
    goal_id: int
    date: str
    value: int = Field(default=1, ge=0)
    note: Optional[str] = None

class CheckInCreate(CheckInBase):
    pass

class CheckIn(CheckInBase):
    id: int
    
    class Config:
        from_attributes = True

# Progress Models - UPDATED
class ProgressByFrequency(BaseModel):
    frequency: str
    goals: list[dict]  # [{goal_id, title, current, target, percentage}]

class GoalProgress(BaseModel):
    goal_id: int
    goal_title: str
    frequency: str
    current_value: int
    target_value: int
    percentage: float
    period_label: str  # "this week", "this month", etc.

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    created_at: str
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    user: User
    token: str
