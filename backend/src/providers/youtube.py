import httpx
from typing import Any, List, Optional
from fastapi import HTTPException
from src.config import settings

BASE_URL = "https://www.googleapis.com/youtube/v3"

class YouTubeProvider:
    @staticmethod
    async def search_videos(
        q: str,
        category_id: Optional[str] = None,
        order: str = "relevance",
        published_after: Optional[str] = None,
        max_results: int = 30
    ) -> List[str]:
        params = {
            "key": settings.youtube_api_key,
            "part": 'id',
            'type': 'video',
            'q': q,
            "order": order,
            "maxResults": max_results
        }

        if category_id:
            params['category_id'] = category_id

        if published_after:
            params['published_after'] = published_after

        async with httpx.AsyncClient() as client:
            resp = await client.get(f'{BASE_URL}/search', params=params)
            YouTubeProvider._handle_response_errors(resp)
            data = resp.json()
            return [item['id']['videoId'] for item in data.get('items', [])]

    @staticmethod
    async def get_video_details(video_ids: List[str]) -> List[dict]:
        if not video_ids:
            return []

        params = {
            'key': settings.youtube_api_key,
            'part': 'snippet,contentDetails,statistics',
            'id': ','.join(video_ids),
        }

        async with httpx.AsyncClient() as client:
            resp = await client.get(f'{BASE_URL}/videos', params = params)
            YouTubeProvider._handle_response_errors(resp)

            return resp.json().get('items', [])


    def _handle_response_errors(resp: httpx.Response):
        if resp.status_code == 200:
            return

        data = resp.json().get('error', {})
        errors = data.get('errors', [])
        is_quota = any(e.get('reason') in ("quotaExceeded", "dailyLimitExceeded") for e in errors)

        if resp.status_code == 403 and is_quota:
            raise HTTPException(
                status_code=429,
                detail={"code": "QUOTA_EXCEEDED", "message": "YouTube API quota exceeded. Try again tomorrow."}
            )

        raise HTTPException(
            status_code=resp.status_code,
            detail={"code": "YOUTUBE_API_ERROR", "message": data.get("message", "API Error")}
        )

