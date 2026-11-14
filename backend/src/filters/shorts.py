from typing import List
from src.config import settings
from src.models import VideoModel

def remove_shorts(videos: List[VideoModel]) -> List[VideoModel]:
    return [v for v in videos if v.duration_sec > settings.shorts_max_seconds]