from fastapi import APIRouter, HTTPException, Depends, status
from models import UserCreate, UserLogin, User, UserResponse
from repositories.user_repository import UserRepository
from auth import create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user.
    Creates user account and seeds default categories.
    """
    try:
        user = UserRepository.create(user_data)
        token = create_access_token(user['id'], user['email'])
        
        return {
            "user": user,
            "token": token
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    """
    Login with email and password.
    Returns user data and JWT token.
    """
    user = UserRepository.authenticate(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(user['id'], user['email'])
    
    return {
        "user": user,
        "token": token
    }

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current logged-in user information.
    Requires valid JWT token.
    """
    user = UserRepository.get_by_id(current_user['user_id'])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout endpoint (client should delete token).
    Token invalidation happens on client side.
    """
    return {"message": "Logged out successfully"}

