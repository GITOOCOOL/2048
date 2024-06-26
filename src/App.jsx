// Just trying what the Github Remote extension is doing. Will it push my changes when I just enter save

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
  const [isConnected, setIsConnected] = useState(false);



  const baseURL = "http://localhost:3000/bestscore";



  
  const resetGrid = () => {
    let newGrid = initializeGrid()
    setGrid(newGrid)
    setPreviousGrid(newGrid)
    setMovesCount(0)
    setScore(0)
    setPreviousScore(0)
    setStartTime(Date.now());
    checkAndUpdateInternetConnection();
    initializeBestScore();

  }

  const checkAndUpdateInternetConnection = async () => {
      try {
        const response = await axios.get('http://localhost:3000/internet_connection')
        console.log('checking internet', response.data);
        setIsConnected(response.data.connection);
      } 
      catch(error) {
        console.log('No server connection');
        setIsConnected(false);
      }
  }
  

  const initializeBestScore = async () => {
          checkAndUpdateInternetConnection();
          if(isConnected){
            try {
              const response = await axios.get(baseURL)
              if(response.data.bestScore === -1){
                console.log('Empty database, so posting a bestScore 0')
                postBestScore(0);
                setBestScore(0);
              }
              else{
                console.log('initializing bestScore with, ', response.data.bestScore);
                setBestScore(response.data.bestScore);
              }
            } catch (error) {
              console.log('error initializing best score');
            }
      }
          }



  const postBestScore = async (bestScore) => {
    checkAndUpdateInternetConnection();
    if(isConnected){
      try {
        const response = await axios.post(baseURL, {bestScore: bestScore})
        console.log('posted'+response+'with id: '+ response.id)
      } 
      catch(error) {
        console.error('Error while postBestScore')
      }
    }
  }

  const checkAndUpdateBestScoreOnEveryScoreChange = async () => {
    try{
      checkAndUpdateInternetConnection();
      if(isConnected){
        const response = await axios.get(baseURL)
        if(response.data.bestScore < score){
          const newBestScore = {bestScore: score}
          const res = await axios.patch(baseURL+'/'+response.data._id,newBestScore)
          console.log('bestScore from db',res.data);
          setBestScore(res.data.bestScore);
        }
      }
    }
    catch(error){
      console.error('Error while checkAndUpdateScoreOnEveryScoreChange')
    }
  }



  useEffect(() => {
    initializeGrid();
    checkAndUpdateInternetConnection();
    initializeBestScore();
  },[]);
  useEffect(()=>{
    initializeBestScore();
  },[isConnected])


  useEffect(()=>{
    checkAndUpdateInternetConnection();
    initializeBestScore();
    checkAndUpdateBestScoreOnEveryScoreChange();
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
          <div className={isConnected?'online':'offline'}></div>
          <Header score={score} bestScore = {bestScore} isConnected={isConnected}  handleNew={handleNew} handleUndo={handleUndo}></Header>
          <Info />
          <Board grid={grid}></Board>
          <Footer movesCount={movesCount} startTime={startTime}/>
        </div>
        <div className="sidebar">
          <Updates />
        </div>
      </div>
    </>
  )
}
export default App

