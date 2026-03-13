import { getAudio, playNext, playPrevious } from "../audio/audioEngine"

export default function Player() {

    const audio = getAudio()

    const next = async () => {

        const song = playNext()

        if (!song) return

        const res = await fetch(`http://127.0.0.1:8000/stream/${song.videoId}`)
        const data = await res.json()

        audio.src = data.audio
        audio.play()
    }

    const prev = async () => {

        const song = playPrevious()

        if (!song) return

        const res = await fetch(`http://127.0.0.1:8000/stream/${song.videoId}`)
        const data = await res.json()

        audio.src = data.audio
        audio.play()
    }

    return (

        <div style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            background: "#111",
            color: "white",
            padding: "10px"
        }}>

            <button onClick={prev}>⏮</button>

            <button onClick={() => audio.play()}>▶</button>

            <button onClick={next}>⏭</button>

        </div>

    )

}