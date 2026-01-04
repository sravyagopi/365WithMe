from fastapi import APIRouter, HTTPException, Query
from models import Goal, GoalCreate, GoalUpdate
from repositories.goal_repository import GoalRepository
from typing import List

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("", response_model=List[Goal])
async def get_goals(include_inactive: bool = Query(False)):
    return GoalRepository.get_all(include_inactive)

@router.get("/category/{category_id}", response_model=List[Goal])
async def get_goals_by_category(category_id: int):
    return GoalRepository.get_by_category(category_id)

@router.get("/{goal_id}", response_model=Goal)
async def get_goal(goal_id: int):
    goal = GoalRepository.get_by_id(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.post("", response_model=Goal, status_code=201)
async def create_goal(goal: GoalCreate):
    return GoalRepository.create(goal)

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(goal_id: int, goal: GoalUpdate):
    updated = GoalRepository.update(goal_id, goal)
    if not updated:
        raise HTTPException(status_code=404, detail="Goal not found")
    return updated

@router.delete("/{goal_id}", status_code=204)
async def delete_goal(goal_id: int):
    if not GoalRepository.delete(goal_id):
        raise HTTPException(status_code=404, detail="Goal not found")