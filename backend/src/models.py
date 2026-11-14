import re
from typing import Optional
from pydantic import BaseModel

def parse_iso_duration(iso_dur: Optional[str]) -> int:
    if not iso_dur:
        return 0

    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_dur)
    if not match:
        return 0

    hour = int(match.group(1) or 0)
    min =  int(match.group(2) or 0)
    sec = int(match.group(3) or 0)

    return hour*3600 + min*60 + sec


class VideoModel(BaseModel):
    id: str
    title: str
    channel: str
    description: str
    thumbnail: str
    duration_sec: int
    view_count: int
    published_at: str
    like_count: Optional[int] = None
    comment_count: Optional[int] = None

    @classmethod
    def from_yt_raw(cls, raw: dict) -> "VideoModel":
        snippet = raw.get("snippet", {})
        stats = raw.get("statistics", {})
        content = raw.get("contentDetails", {})
        thumbs = snippet.get("thumbnails", {})
        thumb_url = (thumbs.get("high") or thumbs.get("medium") or thumbs.get("default") or {}).get("url", "")

        raw_likes = stats.get("likeCount")
        raw_comments = stats.get("commentCount")
        like_count = int(raw_likes) if raw_likes is not None and str(raw_likes).isdigit() else None
        comment_count = int(raw_comments) if raw_comments is not None and str(raw_comments).isdigit() else None

        return cls(
            id=raw.get("id", ""),
            title=snippet.get("title", ""),
            channel=snippet.get("channelTitle", ""),
            description=snippet.get("description", ""),
            thumbnail=thumb_url,
            duration_sec=parse_iso_duration(content.get("duration")),
            view_count=int(stats.get("viewCount") or 0),
            published_at=snippet.get("publishedAt", ""),
            like_count=like_count,
            comment_count=comment_count
        )

