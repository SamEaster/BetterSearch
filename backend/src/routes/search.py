from enum import Enum
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from src.services.search import SearchService

router = APIRouter()

class DurationEnum(str, Enum):
    short = 'short'
    medium = 'medium'
    long = 'long'


@router.get('')
async def search_endpoint(
    q: str = Query(..., min_length=1, description = "Search term"),
    duration: Optional[DurationEnum] = Query(None),
    sort: str = Query('relevance'),
    categoryId: Optional[str] = Query(None),
    hideShorts: bool = Query(True),
    publishedAfter: Optional[str] = Query(None)
):
    from_cache, videos = await SearchService.execute_search(
        q = q, duration = duration.value if duration else None, sort = sort, category_id=categoryId,
        hide_shorts = hideShorts, published_after=publishedAfter
    )

    return {
        "meta": {'fromCache': from_cache, "count": len(videos)},
        "data": videos
    }



