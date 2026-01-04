from fastapi import APIRouter, HTTPException, Query
from services.progress_service import ProgressService
from typing import Optional

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/by-frequency")
async def get_progress_by_frequency(frequency: Optional[str] = Query(None)):
    """
    Get progress for goals grouped by frequency.
    Progress is calculated dynamically within current time windows.
    
    Query params:
    - frequency: Optional filter by specific frequency (daily, weekly, monthly, yearly, custom)
    
    Returns goals with:
    - current_value: SUM(value) within current time window
    - target_value: The goal's target
    - percentage: (current/target) * 100
    """
    return ProgressService.get_progress_by_frequency(frequency)

@router.get("/goal/{goal_id}")
async def get_goal_progress(goal_id: int):
    """
    Get current progress for a specific goal.
    Progress is calculated dynamically based on goal's frequency.
    """
    progress = ProgressService.get_goal_progress(goal_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Goal not found")
    return progress

@router.get("/calendar/{year}")
async def get_year_calendar(year: int):
    """
    Get yearly calendar view.
    Returns check-in counts for each day of the year.
    
    Response format:
    {
        "year": 2025,
        "calendar": {
            "2025-01-15": 3,
            "2025-01-16": 5,
            ...
        }
    }
    """
    return ProgressService.get_year_calendar(year)

@router.get("/calendar")
async def get_current_year_calendar():
    """Get yearly calendar for current year"""
    return ProgressService.get_year_calendar()

@router.get("/day/{date}")
async def get_day_details(date: str):
    """
    Get all check-ins and reflections for a specific day.
    Used when clicking a day in the calendar view.
    
    Returns:
    {
        "date": "2025-01-15",
        "total_checkins": 3,
        "checkins": [
            {
                "id": 1,
                "goal_id": 5,
                "goal_title": "Go to gym",
                "value": 1,
                "note": "Great workout!",
                ...
            }
        ]
    }
    """
    return ProgressService.get_day_details(date)
