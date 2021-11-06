import {useEffect, useState} from 'react'
import axios from 'axios'

import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [dir, setDir] = useState( localStorage.getItem('dir') ||`D:\\COURSES`)
  const [current, setCurrent] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  // const [drive,setDrive] = useState(localStorage.getItem('drive') || 'E:')
  // const [currentDirKey, setCurrentDirKey] = useState(0)
 
  async function fetchData(path){
    const res = await axios({
      url: `http://localhost:3001/?folder=${path}`
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
    video.playbackRate = localStorage.getItem('playbackRate') || 1.5
    video.play()


    video.onratechange = (e)=>{
      localStorage.setItem('playbackRate', video.playbackRate)
    }
  }


  const handleFolderChange = (e)=>{
    setDir(e.target.value)
    localStorage.setItem('dir',e.target.value)
  }

  const changePlaybackRate = (type)=>{
    const video = document.querySelector('video')

    if(type==="reset"){video.playbackRate = 1; return}

    if(type==="increase"){video.playbackRate = video.playbackRate + 0.25; return}

    video.playbackRate = video.playbackRate - 0.25
  }


  const getDir = ()=>{

    let paths = dir.replace(/\\$/,"").split("\\")
    return paths.map((path, index)=>{
      return (<span key={index} onClick={()=>{generateNewPath(index, paths)}} className="dir__name">{path}\</span>)
    })
  }

  // D:\COURSES\100 Days Python 2021\01. Day 1 - Beginner - Working with Variables in Python to Manage Data\
  const generateNewPath = (key, paths)=>{

    let currentKey = key

    let newPath = "";
    for (const key in paths) {
      if (key < currentKey+1) {
        newPath += paths[key] + "\\";
      }
    }

    setDir(newPath)
    fetchData(newPath)
  }

  const handleFolder = (item)=>{

    if(item.match(".html") || item.match(".srt")) {return}

    let newPath = dir+item
    setDir(newPath)
    fetchData(newPath)
  }

  const handleBack = ()=>{

    const dir2 = dir.replace(/\\$/,"")

    let paths = dir2.split("\\")
    let currentKey = paths.length-1


    let newPath = "";
    for (const key in paths) {
      if (key < currentKey) {
        newPath += paths[key] + "\\";
      }
    }

    setDir(newPath)

    fetchData(newPath)

  }


  return (
    <>
      <div className="">
        {/*<label>Drive</label> <input value={drive}  onChange={(e)=>handleDriveChange(e)} type="text" />*/}
        <label>Folder</label><input value={dir} onChange={(e)=>handleFolderChange(e)} type="text" />
        <button className="btn btn-sm" onClick={()=>fetchData(dir)}>GET</button>
      </div>
    
      <div className="App grid-container">

        <div className="grid-item">
          <h3>Playing: {current}</h3>
          <video width="100%" controls></video>

          <button onClick={()=>changePlaybackRate('decrease')}>- .25x</button>
          <button onClick={()=>changePlaybackRate('increase')}>+ .25x</button>
          <button onClick={()=>changePlaybackRate('reset')}>1x</button>
        </div>

        <div className="grid-item">

          <h3><button onClick={()=>handleBack()}> &uarr; </button> {getDir()}</h3>

          <ul className="file-list">
            {items.map((item, index)=>{
              return (<li key={item} className={currentIndex===index? 'active':''}>
                {item.match('.mp4') ? <p onClick={()=>handleVideo(index, item)}><img src='play-button.svg' width="30" alt="play" /> {item}</p> :
                  <p onClick={()=>handleFolder(item)}>{item}</p>
                }                 
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