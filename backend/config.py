import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "365WithMe API"
    database_url: str = "sqlite:///./365withme.db"
    api_version: str = "v1"
    cors_origins: list = ["http://localhost:3000", "http://localhost:3001"]
    
    # JWT Settings
    jwt_secret: str = "secret-key" #To-do: change this
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()