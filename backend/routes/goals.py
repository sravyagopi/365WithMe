from fastapi import APIRouter, HTTPException, Query, Depends
from models import Goal, GoalCreate, GoalUpdate
from repositories.goal_repository import GoalRepository
from dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("", response_model=List[Goal])
async def get_goals(
    include_inactive: bool = Query(False),
    current_user: dict = Depends(get_current_user)
):
    """Get all goals for the current user"""
    return GoalRepository.get_all(current_user['user_id'], include_inactive)

@router.get("/category/{category_id}", response_model=List[Goal])
async def get_goals_by_category(
    category_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """Get goals by category for the current user"""
    return GoalRepository.get_by_category(category_id, current_user['user_id'])

@router.get("/{goal_id}", response_model=Goal)
async def get_goal(
    goal_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """Get a specific goal (user must own it)"""
    goal = GoalRepository.get_by_id(goal_id, current_user['user_id'])
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.post("", response_model=Goal, status_code=201)
async def create_goal(
    goal: GoalCreate, 
    current_user: dict = Depends(get_current_user)
):
    """Create a new goal for the current user"""
    return GoalRepository.create(goal, current_user['user_id'])

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: int, 
    goal: GoalUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update a goal (user must own it)"""
    updated = GoalRepository.update(goal_id, goal, current_user['user_id'])
    if not updated:
        raise HTTPException(status_code=404, detail="Goal not found")
    return updated

@router.delete("/{goal_id}", status_code=204)
async def delete_goal(
    goal_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """Delete a goal (user must own it)"""
    if not GoalRepository.delete(goal_id, current_user['user_id']):
        raise HTTPException(status_code=404, detail="Goal not found")
