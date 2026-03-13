import { useState } from "react"
import { playStream, setQueue } from "../audio/audioEngine"

export default function Search() {

    const [songs, setSongs] = useState([])

    const search = async (e) => {

        const q = e.target.value

        if (q.length < 2) return

        const res = await fetch(`http://127.0.0.1:8000/search?query=${q}`)
        const data = await res.json()

        setSongs(data)
    }


    const play = async (song, index) => {

        setQueue(songs, index)

        const res = await fetch(`http://127.0.0.1:8000/stream/${song.videoId}`)
        const data = await res.json()

        playStream(data.audio)

    }


    return (

        <div style={{ padding: "20px" }}>

            <h2>Search Music</h2>

            <input placeholder="Search music..." onChange={search} />

            {songs.map((song, index) => (

                <div key={song.videoId}>

                    <img src={song.albumArt} width="60" />

                    {song.title} - {song.artist}

                    <button onClick={() => play(song, index)}>
                        ▶ Play
                    </button>

                </div>

            ))}

        </div>
    )
}