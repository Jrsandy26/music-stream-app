from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ytmusicapi import YTMusic
import yt_dlp

app = FastAPI()

# allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ytmusic = YTMusic()


@app.get("/")
def home():
    return {"message": "Music API running"}


# SEARCH MUSIC
@app.get("/search")
def search_music(query: str):

    results = ytmusic.search(query, filter="songs")

    songs = []

    for r in results[:10]:
        songs.append({
            "title": r["title"],
            "artist": r["artists"][0]["name"],
            "videoId": r["videoId"],
            "albumArt": r["thumbnails"][-1]["url"]
        })

    return songs


# STREAM MUSIC
@app.get("/stream/{video_id}")
def stream_music(video_id: str):

    url = f"https://youtube.com/watch?v={video_id}"

    ydl_opts = {
        "format": "bestaudio",
        "quiet": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    return {"audio": info["url"]}