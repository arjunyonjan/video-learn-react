import {useEffect, useState} from 'react'
import axios from 'axios'

import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [dir, setDir] = useState( localStorage.getItem('dir') ||`COURSES`)
  const [current, setCurrent] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drive,setDrive] = useState(localStorage.getItem('drive') || 'E:')
 
  async function fetchData(){

      // const urlSearchParams = new URLSearchParams(window.location.search);
      // const params = Object.fromEntries(urlSearchParams.entries());
      const res = await axios({
        url: `http://localhost:3001/?folder=${dir}&drive=${drive}`
      })
      setItems(res.data.files)
    }

  useEffect(()=>{
    // fetchData()   
  },[])

  const handleVideo = (index, item)=>{
    const host = 'http://127.0.0.1:8848'
    const video = document.querySelector('video')
    setCurrent(item)
    setCurrentIndex(index)

    const newDir = dir.replace(/^.:\\/,"")

    const src = `${host}/${newDir}/${encodeURIComponent(item)}`
    video.src = src
    video.playbackRate = 1.5
    video.play()
  }

  const handleDriveChange= (e)=>{
    setDrive(e.target.value)
    localStorage.setItem('drive',e.target.value)
  }

  const handleFolderChange = (e)=>{
    setDir(e.target.value)
    localStorage.setItem('dir',e.target.value)
  }

  return (
    <>
      <div className="">
        <label>Drive</label> <input value={drive}  onChange={(e)=>handleDriveChange(e)} type="text" />
        <label>Folder</label><input value={dir} onChange={(e)=>handleFolderChange(e)} type="text" />
        <button className="btn btn-sm" onClick={fetchData}>GET</button>
      </div>
    
      <div className="App grid-container">

        <div className="grid-item">
          <h3>Playing: {current}</h3>
          <video width="100%" controls></video>
        </div>

        <div className="grid-item file-list">

          <h3>{dir}</h3>

          <ul>
            {items.map((item, index)=>{
              return (<li key={item} className={currentIndex===index? 'active':''} onClick={()=>handleVideo(index, item)}>
                 <p>{item.match('.mp4') ? <img src='play-button.svg' width="30" alt="play" /> : null}{item}</p>
              </li>)
            })}
          </ul>
        </div>

        {/*<div className="grid-item">
          <h1>{dir}</h1>
          <ul>
            {items.map((item, index)=>{
              return (<li key={item} className={currentIndex===index? 'active':''} onClick={()=>handleClick(index, item)}>{item}</li>)
            })}
          </ul>
        </div>*/}

      </div>  
    </>    
  );
}

export default App;