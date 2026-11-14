from typing import List, Optional
from src.models import VideoModel

def apply_duration_filter(videos: List[VideoModel], duration_type: Optional[str]) -> List[VideoModel]:
    if not duration_type:
        return videos
    if duration_type == "short":
        return [v for v in videos if v.duration_sec <= 240]
    if duration_type == "medium":
        return [v for v in videos if 240 < v.duration_sec <= 1200]
    if duration_type == "long":
        return [v for v in videos if v.duration_sec > 1200]
    return videos