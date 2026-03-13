# HydeMusic 🎵

Free music streaming web app built with React and FastAPI.

## Features

- Song search using ytmusicapi
- Streaming audio using yt-dlp
- Queue system
- Crossfade playback
- React music player

## Tech Stack

Frontend:
- React
- Material UI

Backend:
- FastAPI
- ytmusicapi
- yt-dlp

## Setup

Clone repository

git clone https://github.com/Jrsandy26/music-stream-app.git

cd music-stream-app

Run setup

./setup.sh

Start backend

cd backend
source venv/bin/activate
uvicorn main:app --reload

Start frontend

cd frontend
npm start
