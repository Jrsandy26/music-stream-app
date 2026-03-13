import { useState } from "react";

export default function Search(){

 const [songs,setSongs] = useState([]);

 const search = async(e)=>{

  const q = e.target.value;

  const res = await fetch(`http://127.0.0.1:8000/search?query=${q}`);

  const data = await res.json();

  setSongs(data);
 };

 return(
  <div>

   <input placeholder="Search music" onChange={search}/>

   {songs.map(song=>(
     <div key={song.videoId}>
        <img src={song.albumArt} width="100"/>
        <p>{song.title}</p>
     </div>
   ))}

  </div>
 );
}