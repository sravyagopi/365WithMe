from fastapi import APIRouter, HTTPException
from models import CheckIn, CheckInCreate
from repositories.checkin_repository import CheckInRepository
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/checkins", tags=["checkins"])

@router.get("/today", response_model=List[CheckIn])
async def get_today_checkins():
    """Get all check-in events for today"""
    today = date.today().isoformat()
    return CheckInRepository.get_by_date(today)

@router.get("/date/{check_date}", response_model=List[CheckIn])
async def get_checkins_by_date(check_date: str):
    """Get all check-in events for a specific date"""
    return CheckInRepository.get_by_date(check_date)

@router.get("/goal/{goal_id}", response_model=List[CheckIn])
async def get_checkins_by_goal(goal_id: int, start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Get all check-in events for a specific goal with optional date range"""
    return CheckInRepository.get_by_goal(goal_id, start_date, end_date)

@router.post("", response_model=CheckIn, status_code=201)
async def create_checkin(checkin: CheckInCreate):
    """
    Create a new check-in event.
    ALWAYS inserts a new row - no update logic.
    Multiple check-ins per day per goal are allowed.
    """
    return CheckInRepository.create(checkin)

@router.delete("/{checkin_id}", status_code=204)
async def delete_checkin(checkin_id: int):
    """Delete a specific check-in event"""
    if not CheckInRepository.delete(checkin_id):
        raise HTTPException(status_code=404, detail="Check-in not found")
