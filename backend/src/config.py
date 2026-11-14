from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    port: int = 8000
    youtube_api_key: str
    redis_url: str = "redis://localhost:6379"
    shorts_max_seconds: int = 180
    search_cache_ttl_sec: int = 900
    video_cache_ttl_sec: int = 3600

    # class Config:
    #     env_file = '.env'
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()