import json
import logging
import redis.asyncio as redis
from typing import Any, Optional
from src.config import settings

logger = logging.getLogger(__name__)

redis_client = redis.from_url(
    settings.redis_url,
    decode_responses = True,
    socket_connect_timeout = 1
)

async def get_cache(key: str) -> Optional[Any]:
    try:
        val = await redis_client.get(key)
        return json.loads(val) if val else None
    except Exception as e:
        logging.warning(f'Cache GET bypass on {key}: {e}')

        return None

async def set_cache(key: str, value: Any, ttl_sec: int) -> None:
    try: 
        await redis_client.set(key, json.dumps(value), ex = ttl_sec)

    except Exception as e:
        logging.warning(f'Cache SET bypass on {key}: {e}')