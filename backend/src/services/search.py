from typing import List, Optional, Tuple
from src.config import settings
from src.cache import get_cache, set_cache
from src.models import VideoModel
from src.providers.youtube import YouTubeProvider
from src.filters.shorts import remove_shorts
from src.filters.duration import apply_duration_filter
from fastapi import HTTPException

class SearchService:
    @staticmethod
    def _make_cache_key(
        q: str, 
        duration: Optional[str], 
        sort: str, 
        category_id: Optional[str],
        hide_shorts: bool,
        published_after: Optional[str]
    ) -> str:

        parts = [
            q.strip().lower(),
            (duration or "").strip().lower(),
            sort.strip().lower(),
            (category_id or "").strip(),
            "hide" if hide_shorts else "show",
            (published_after or "").strip()
        ]

        return f"search:{'|'.join(parts)}"

    @classmethod
    async def execute_search(
        cls,
        q: str, 
        duration: Optional[str],
        sort: str,
        category_id: Optional[str],
        hide_shorts: bool,
        published_after: Optional[str]
    ) -> Tuple[bool, List[dict]]:
        cache_key = cls._make_cache_key(q, duration, sort, category_id, hide_shorts, published_after)
        cached = await get_cache(cache_key)

        if cached is not None:
            return True, cached

        video_ids = await YouTubeProvider.search_videos(
            q, category_id, sort, published_after, max_results=30
        )

        if not video_ids:
            await set_cache(cache_key, [], settings.search_cache_ttl_sec)
            return False, []
        
        raw_items = await YouTubeProvider.get_video_details(video_ids)
        videos = [VideoModel.from_yt_raw(item) for item in raw_items]

        if hide_shorts:
            videos = remove_shorts(videos)
        if duration:
            videos = apply_duration_filter(videos, duration)

        serializable = [v.model_dump() for v in videos]
        await set_cache(cache_key, serializable, settings.search_cache_ttl_sec)
        return False, serializable

    @classmethod
    async def get_video_id(cls, video_id: str) -> Tuple[bool, dict]:
        cache_key = f'video:{video_id}'
        cached = await get_cache(cache_key)
        if cached:
            return True, cached

        raw_items = await YouTubeProvider.get_video_details([video_id])
        if not raw_items:
            raise HTTPException(status_code = 404, detail = {'code': "NOT_FOUND", 'messsage': "Video not found"})

        video = VideoModel.from_yt_raw(raw_items[0]).model_dump()
        await set_cache(cache_key, video, settings.search_cache_ttl_sec)
        return False, video 
    
        
 