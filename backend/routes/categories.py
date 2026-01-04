from fastapi import APIRouter, HTTPException
from models import Category, CategoryCreate, CategoryUpdate
from repositories.category_repository import CategoryRepository
from typing import List

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[Category])
async def get_categories():
    return CategoryRepository.get_all()

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int):
    category = CategoryRepository.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("", response_model=Category, status_code=201)
async def create_category(category: CategoryCreate):
    try:
        return CategoryRepository.create(category)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: int, category: CategoryUpdate):
    updated = CategoryRepository.update(category_id, category)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int):
    if not CategoryRepository.delete(category_id):
        raise HTTPException(status_code=404, detail="Category not found")

