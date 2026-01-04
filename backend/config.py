import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "365WithMe API"
    database_url: str = "sqlite:///./365withme.db"
    api_version: str = "v1"
    cors_origins: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"

settings = Settings()