export function getRecommendations(allSongs){

 const user = JSON.parse(localStorage.getItem("user"))

 if(!user || user.history.length === 0) return []

 const genres = user.history.map(s => s.genre)
 const artists = user.history.map(s => s.artist)

 return allSongs.filter(song =>
  genres.includes(song.genre) ||
  artists.includes(song.artist)
 )

}