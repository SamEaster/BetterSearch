from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from src.config import settings
from src.routes.video import router as video_router
from src.routes.search import router as search_router

app = FastAPI(title = 'BetterSearch Backend', version = '1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/health')
async def health():
    return {"status": "live", 'timestamp': datetime.utcnow().isoformat()}


app.include_router(search_router, prefix = '/api/v1/search', tags = ['Search'])
app.include_router(video_router, prefix = '/api/v1/videos', tags = ['Videos'])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run('src.main:app', host = '0.0.0.0', port = settings.port, reload=True)


