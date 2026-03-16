const API = "http://127.0.0.1:8000"

export async function login(email,password){

 const res = await fetch(`${API}/login`,{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({email,password})
 })

 return res.json()
}

export async function register(email,password){

 const res = await fetch(`${API}/register`,{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({email,password})
 })

 return res.json()
}

export async function searchMusic(query){

 const res = await fetch(`${API}/search?query=${query}`)

 return res.json()
}

export async function streamSong(videoId){

 const res = await fetch(`${API}/stream/${videoId}`)

 return res.json()
}

export async function saveHistory(song){

 const token = localStorage.getItem("token")

 const res = await fetch(`${API}/history`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   "Authorization":`Bearer ${token}`
  },
  body: JSON.stringify(song)
 })

 return res.json()
}

export async function getRecommendations(userId){

 const res = await fetch(`${API}/recommend/${userId}`)

 return res.json()
}