from fastapi import APIRouter, HTTPException, Query, Depends
from models import CheckIn, CheckInCreate
from repositories.checkin_repository import CheckInRepository
from dependencies import get_current_user
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/checkins", tags=["checkins"])

@router.get("/today", response_model=List[CheckIn])
async def get_today_checkins(current_user: dict = Depends(get_current_user)):
    """Get all check-ins for today for the current user"""
    today = date.today().isoformat()
    return CheckInRepository.get_by_date(today, current_user['user_id'])

@router.get("/date/{check_date}", response_model=List[CheckIn])
async def get_checkins_by_date(
    check_date: str, 
    current_user: dict = Depends(get_current_user)
):
    """Get all check-ins for a specific date for the current user"""
    return CheckInRepository.get_by_date(check_date, current_user['user_id'])

@router.get("/goal/{goal_id}", response_model=List[CheckIn])
async def get_checkins_by_goal(
    goal_id: int,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Get all check-ins for a specific goal (user must own goal)"""
    return CheckInRepository.get_by_goal(
        goal_id, 
        current_user['user_id'], 
        start_date, 
        end_date
    )

@router.post("", response_model=CheckIn, status_code=201)
async def create_checkin(
    checkin: CheckInCreate, 
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new check-in event for the current user.
    ALWAYS inserts a new row - no update logic.
    Multiple check-ins per day per goal are allowed.
    """
    return CheckInRepository.create(checkin, current_user['user_id'])

@router.delete("/{checkin_id}", status_code=204)
async def delete_checkin(
    checkin_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """Delete a specific check-in event (user must own it)"""
    if not CheckInRepository.delete(checkin_id, current_user['user_id']):
        raise HTTPException(status_code=404, detail="Check-in not found")
