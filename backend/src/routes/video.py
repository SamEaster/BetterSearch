from fastapi import APIRouter
from src.services.search import SearchService

router = APIRouter()

@router.get("/{video_id}")
async def get_video_endpoint(video_id: str):
    from_cache, video = await SearchService.get_video_id(video_id)

    return {
        'meta': {"fromCache": from_cache},
        "data": video
    }
