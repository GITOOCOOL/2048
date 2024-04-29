import { useEffect, useState } from 'react';
import './App.css'


import Board from './components/Board';
import Updates from './components/Updates';
import Header from './components/Header';
import Footer from './components/Footer';
import Info from './components/Info';

import axios from 'axios';



import {handle} from './handlers'


const App = () => {
  
  
  const initializeGrid = () => {
      /* Initializing the grid with 2 random tiles with value of 2*/
          let randpos1x = Math.floor(Math.random() * 4);
          let randpos1y = Math.floor(Math.random() * 4);
          let randpos2x = Math.floor(Math.random() * 4);
          let randpos2y = Math.floor(Math.random() * 4);
          let tmp = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
          tmp[randpos1x][randpos1y] = 2
          tmp[randpos2x][randpos2y] = 2
          return tmp;
  }
  const [grid, setGrid] = useState(initializeGrid());
  const [movesCount, setMovesCount] = useState(0);
  const [previousGrid, setPreviousGrid] = useState(grid)
  const [score, setScore] = useState(0)
  const [previousScore, setPreviousScore] = useState(score)

  const [startTime, setStartTime] = useState(Date.now())

  const [bestScore, setBestScore] = useState(0);

  const baseURL = "http://localhost:8000/bestscore";



  
  const resetGrid = () => {
    let newGrid = initializeGrid()
    setGrid(newGrid)
    setPreviousGrid(newGrid)
    setMovesCount(0)
    setScore(0)
    setPreviousScore(0)
    setStartTime(Date.now());
  }

  const initializeBestScore = async () => {
    try {
      const response = await axios.get(baseURL)
      if(!response.data.bestScore){
        postBestScore(0);
        setBestScore(0);
      }
      else{
        setBestScore(response.data.bestScore);
      }
      console.log(response.data.bestScore);
    } 
    catch(error) {
      console.log(error);
    }
  }

  const postBestScore = async (bestScore) => {
    try {
      const response = await axios.post(baseURL, {bestScore: bestScore})
      console.log('posted'+response+'with id: '+ response.id)
    } 
    catch(error) {
      console.log(error);
    }
  }

  const checkAndUpdateBestScoreOnEveryScoreChange = async () => {
    try{
      const response = await axios.get(baseURL)
      if(response.data.bestScore < score){
        const newBestScore = {bestScore: score}
        const res = await axios.patch(baseURL+'/'+response.data._id,newBestScore)
        console.log('here',res.data);
        setBestScore(res.data.bestScore);
      }
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    initializeGrid();
    initializeBestScore();
    
  },[]);

  useEffect(()=>{
    checkAndUpdateBestScoreOnEveryScoreChange()
  },[score])


  const handleNew = (e)=>{
    e.preventDefault();
    resetGrid();
  }
  const handleUndo = (e)=>{
    e.preventDefault();
    setGrid(previousGrid);
    setPreviousGrid(grid);
    setScore(previousScore);
  }


  document.onkeydown = (e) => {
    handle(e.code,grid,score, previousGrid, previousScore,movesCount, setGrid, setScore, setPreviousGrid, setPreviousScore, setMovesCount);
    if(grid.flat().reduce((acc,num)=> acc * num) !=0){
      // handleNewBestScore(score);

      alert('game over, press ok to get a new game');
      resetGrid();
    }
  }


  return (
    <>
      <div className="container">
        <div className="game-window">
          <Header score={score} bestScore = {bestScore} handleNew={handleNew} handleUndo={handleUndo}></Header>
          <Info />
          <Board grid={grid}></Board>
          <Footer movesCount={movesCount} startTime={startTime}/>
        </div>
        <div className="sidebar">
          <Updates></Updates>
        </div>
      </div>
    </>
  )
}

export default App

