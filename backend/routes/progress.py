from fastapi import APIRouter, HTTPException, Query, Depends
from services.progress_service import ProgressService
from dependencies import get_current_user
from typing import Optional

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/by-frequency")
async def get_progress_by_frequency(
    frequency: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Get progress for goals grouped by frequency for the current user.
    Progress is calculated dynamically within current time windows.
    """
    return ProgressService.get_progress_by_frequency(
        current_user['user_id'], 
        frequency
    )

@router.get("/goal/{goal_id}")
async def get_goal_progress(
    goal_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """
    Get current progress for a specific goal (user must own it).
    Progress is calculated dynamically based on goal's frequency.
    """
    progress = ProgressService.get_goal_progress(goal_id, current_user['user_id'])
    if not progress:
        raise HTTPException(status_code=404, detail="Goal not found")
    return progress

@router.get("/calendar/{year}")
async def get_year_calendar(
    year: int, 
    current_user: dict = Depends(get_current_user)
):
    """
    Get yearly calendar view for the current user.
    Returns check-in counts for each day of the year.
    """
    return ProgressService.get_year_calendar(year, current_user['user_id'])

@router.get("/calendar")
async def get_current_year_calendar(current_user: dict = Depends(get_current_user)):
    """Get yearly calendar for current year for the current user"""
    return ProgressService.get_year_calendar(None, current_user['user_id'])

@router.get("/day/{date}")
async def get_day_details(
    date: str, 
    current_user: dict = Depends(get_current_user)
):
    """
    Get all check-ins and reflections for a specific day for the current user.
    Used when clicking a day in the calendar view.
    """
    return ProgressService.get_day_details(date, current_user['user_id'])
