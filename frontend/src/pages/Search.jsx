import { useState } from "react"
import { playStream, setQueue } from "../audio/audioEngine"
import {
  TextField,
  Grid,
  Box,
  InputAdornment,
  styled,
  alpha,
  Typography,
  Container,
  Fade,
  IconButton,
  CircularProgress
} from "@mui/material"

import SongCard from "../components/SongCard"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"

import { searchMusic, streamSong, saveHistory } from "../api/api"


/* ------------------ EXPRESSIVE SEARCH BAR ------------------ */

const ExpressiveSearchDock = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "32px",
    backgroundColor: alpha("#fff", 0.1),
    backdropFilter: "blur(20px)",
    height: "64px",
    fontSize: "1.1rem",
    color: "#fff",
    transition: "all 0.4s",
    border: "1px solid rgba(255,255,255,0.1)",
    "& fieldset": { border: "none" },

    "&.Mui-focused": {
      backgroundColor: alpha("#fff", 0.15),
      transform: "scale(1.02)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      border: "1px solid rgba(252,217,230,0.3)"
    }
  }
}))



export default function Search(){

 const [songs,setSongs] = useState([])
 const [query,setQuery] = useState("")
 const [loading,setLoading] = useState(false)


 /* ------------------ SEARCH ------------------ */

 const search = async (e) => {

  const q = e.target.value
  setQuery(q)

  if(q.length < 2){
   setSongs([])
   return
  }

  try{

   setLoading(true)

   const data = await searchMusic(q)

   setSongs(data)

  }catch(err){

   console.error("Search error:",err)

  }finally{

   setLoading(false)

  }

 }


 /* ------------------ PLAY SONG ------------------ */

 const play = async (song,index) => {

  try{

   setQueue(songs,index)

   const data = await streamSong(song.videoId)

   if(!data.audio) return

   playStream(data.audio)

   /* save listening history for recommendations */

   await saveHistory({
    title: song.title,
    artist: song.artist
   })

  }catch(err){

   console.error("Play error:",err)

  }

 }



 return(

<Box sx={{ minHeight:"100vh", bgcolor:"#7C314C", pb:"200px" }}>


{/* HEADER */}

<Box
 sx={{
  pt:8,
  pb:4,
  px:4,
  position:"sticky",
  top:0,
  zIndex:10,
  background:"linear-gradient(to bottom,#7C314C 70%,transparent)"
 }}
>

<Container maxWidth="md">

<Typography
 variant="h3"
 sx={{
  color:"white",
  fontWeight:900,
  letterSpacing:-1.5,
  mb:3,
  textAlign:{xs:"left",md:"center"}
 }}
>
Explore
</Typography>


<ExpressiveSearchDock
 fullWidth
 placeholder="Artist, songs, or podcasts"
 variant="outlined"
 onChange={search}
 InputProps={{
  startAdornment:(
   <InputAdornment position="start">
    <SearchRoundedIcon sx={{color:"#FCD9E6",ml:1,fontSize:28}}/>
   </InputAdornment>
  ),

  endAdornment:(
   <InputAdornment position="end">
    <IconButton sx={{color:"white",mr:1}}>
     <TuneRoundedIcon/>
    </IconButton>
   </InputAdornment>
  )
 }}
/>

</Container>

</Box>



{/* RESULT SECTION */}

<Container maxWidth="xl">

{loading && (
<Box sx={{display:"flex",justifyContent:"center",mt:6}}>
<CircularProgress sx={{color:"#FCD9E6"}}/>
</Box>
)}


{songs.length > 0 && (

<Typography
 variant="overline"
 sx={{
  color:alpha("#fff",0.5),
  mb:2,
  display:"block",
  ml:2,
  fontWeight:700
 }}
>
Top Results for "{query}"
</Typography>

)}



<Grid container spacing={3}>

{songs.map((song,index)=>(

<Fade in timeout={(index%10)*100} key={song.videoId}>

<Grid item xs={6} sm={4} md={3} lg={2.4} xl={2}>

<Box sx={{display:"flex",justifyContent:"center"}}>

<SongCard
 song={song}
 onPlay={()=>play(song,index)}
/>

</Box>

</Grid>

</Fade>

))}

</Grid>



{/* EMPTY STATE */}

{songs.length === 0 && !loading && (

<Box
 sx={{
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"center",
  mt:10
 }}
>

<Box
 sx={{
  width:120,
  height:120,
  borderRadius:"40px",
  bgcolor:alpha("#FCD9E6",0.1),
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  mb:3
 }}
>
<MusicNoteRoundedIcon sx={{fontSize:60,color:"#FCD9E6"}}/>
</Box>

<Typography variant="h5" sx={{color:"white",fontWeight:700,opacity:.8}}>
Listen to the world
</Typography>

<Typography variant="body1" sx={{color:alpha("#fff",0.5),mt:1}}>
Search for your next favorite track
</Typography>

</Box>

)}

</Container>

</Box>

 )

}