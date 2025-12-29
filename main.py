from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/info")
async def get_info(url: str = Query(...)):
    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract video URL
            video_url = info.get('url')
            if not video_url and 'formats' in info:
                # Fallback to the best available format
                video_url = info['formats'][-1]['url']

            return {
                "status": "success",
                "result": {
                    "url": video_url,
                    "thumbnail": info.get('thumbnail'),
                    "title": info.get('description') or info.get('title') or "Instagram Media",
                    "type": "video" if info.get('vcodec') != 'none' else "image"
                }
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
