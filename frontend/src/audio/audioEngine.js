let audio = new Audio()

let queue = []
let currentIndex = 0

export function setQueue(songList, startIndex = 0) {
    queue = songList
    currentIndex = startIndex
}

export function playStream(url) {
    audio.src = url
    audio.play()
}

export function playNext() {
    if (currentIndex < queue.length - 1) {
        currentIndex++
        return queue[currentIndex]
    }
}

export function playPrevious() {
    if (currentIndex > 0) {
        currentIndex--
        return queue[currentIndex]
    }
}

export function getAudio() {
    return audio
}

export function getQueue() {
    return queue
}

export function getCurrentIndex() {
    return currentIndex
}