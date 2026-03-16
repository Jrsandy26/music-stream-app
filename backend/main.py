from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import database as db_file # To avoid circular imports
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from ytmusicapi import YTMusic
import yt_dlp

# -----------------------
# CONFIG
# -----------------------

SECRET_KEY = "music_secret"
ALGORITHM = "HS256"

DATABASE_URL = "sqlite:///./music.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"])

app = FastAPI()

ytmusic = YTMusic()

# -----------------------
# CORS
# -----------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# DATABASE MODELS
# -----------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    title = Column(String)
    artist = Column(String)


Base.metadata.create_all(bind=engine)

# -----------------------
# DB SESSION
# -----------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------
# AUTH
# -----------------------

def create_token(user_id: int):

    payload = {"user_id": user_id}

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


# -----------------------
# REGISTER
# -----------------------

@app.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):

    hashed = pwd_context.hash(password)

    user = User(email=email, password=hashed)

    db.add(user)
    db.commit()

    return {"message": "User created"}


# -----------------------
# LOGIN
# -----------------------

@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_token(user.id)

    return {"token": token}


# -----------------------
# SEARCH MUSIC
# -----------------------

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


# -----------------------
# STREAM MUSIC
# -----------------------

@app.get("/stream/{video_id}")
def stream_music(video_id: str):

    url = f"https://youtube.com/watch?v={video_id}"

    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio",
        "quiet": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    return {"audio": info["url"]}


# -----------------------
# SAVE HISTORY
# -----------------------

@app.post("/history")
def save_history(user_id: int, title: str, artist: str, db: Session = Depends(get_db)):

    h = History(user_id=user_id, title=title, artist=artist)

    db.add(h)
    db.commit()

    return {"message": "saved"}


# -----------------------
# RECOMMENDATION
# -----------------------

@app.get("/recommend/{user_id}")
def recommend(user_id: int, db: Session = Depends(get_db)):

    history = db.query(History).filter(History.user_id == user_id).all()

    artists = [h.artist for h in history]

    recommendations = []

    for artist in artists:

        songs = ytmusic.search(artist, filter="songs")

        for s in songs[:2]:

            recommendations.append({
                "title": s["title"],
                "artist": s["artists"][0]["name"],
                "videoId": s["videoId"],
                "albumArt": s["thumbnails"][-1]["url"]
            })

    return recommendations

