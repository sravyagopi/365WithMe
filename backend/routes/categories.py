from fastapi import APIRouter, HTTPException, Depends
from models import Category, CategoryCreate, CategoryUpdate
from repositories.category_repository import CategoryRepository
from dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[Category])
async def get_categories(current_user: dict = Depends(get_current_user)):
    """Get all categories for the current user"""
    return CategoryRepository.get_all(current_user['user_id'])

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific category (user must own it)"""
    category = CategoryRepository.get_by_id(category_id, current_user['user_id'])
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("", response_model=Category, status_code=201)
async def create_category(
    category: CategoryCreate, 
    current_user: dict = Depends(get_current_user)
):
    """Create a new category for the current user"""
    try:
        return CategoryRepository.create(category, current_user['user_id'])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: int, 
    category: CategoryUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update a category (user must own it)"""
    updated = CategoryRepository.update(category_id, category, current_user['user_id'])
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated

@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int, 
    current_user: dict = Depends(get_current_user)
):
    """Delete a category (user must own it)"""
    if not CategoryRepository.delete(category_id, current_user['user_id']):
        raise HTTPException(status_code=404, detail="Category not found")
