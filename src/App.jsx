import { useEffect, useState, useRef } from "react";
import "./App.css";

import Board from "./components/Board";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./components/Info";
import DeveloperMenu from "./components/DeveloperMenu";
import GameOverModal from "./components/GameOverModal";
import { checkGameOver } from "./utils/gameLogic";

import axios from "axios";

import { handle } from "./handlers";

const App = () => {
  const initializeGrid = () => {
    /* Initializing the grid with 2 random tiles with value of 2*/
    let randpos1x = Math.floor(Math.random() * 4);
    let randpos1y = Math.floor(Math.random() * 4);
    let randpos2x = Math.floor(Math.random() * 4);
    let randpos2y = Math.floor(Math.random() * 4);
    let tmp = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    tmp[randpos1x][randpos1y] = 2;
    tmp[randpos2x][randpos2y] = 2;
    return tmp;
  };
  const [grid, setGrid] = useState(initializeGrid());
  const [movesCount, setMovesCount] = useState(0);
  const [previousGrid, setPreviousGrid] = useState(grid);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(score);
  const [startTime, setStartTime] = useState(Date.now());
  const [bestScore, setBestScore] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const baseURL = "http://localhost:3000/bestscore";

  const resetGrid = () => {
    let newGrid = initializeGrid();
    setGrid(newGrid);
    setPreviousGrid(newGrid);
    setMovesCount(0);
    setScore(0);
    setPreviousScore(0);
    setStartTime(Date.now());
    setIsGameOver(false);
    initializeBestScore();
  };

  const initializeBestScore = async () => {
    try {
      const response = await axios.get(baseURL);
      if (response.data.bestScore === -1) {
        console.log("Empty database, so posting a bestScore 0");
        postBestScore(0);
        setBestScore(0);
        setIsConnected(true);
      } else {
        console.log("initializing bestScore with, ", response.data.bestScore);
        setBestScore(response.data.bestScore);
        setIsConnected(true);
      }
    } catch (error) {
      console.log("error initializing best score");
      console.log("Maybe disconnected from the server");
      setIsConnected(false);
    }
  };

  const postBestScore = async (bestScore) => {
    try {
      const response = await axios.post(baseURL, { bestScore: bestScore });
      console.log("posted" + response + "with id: " + response.id);
      setIsConnected(true);
    } catch (error) {
      console.error("Error while postBestScore");
      setIsConnected(false);
    }
  };

  // Optimization: Debounce API calls
  useEffect(() => {
    const checkAndUpdateBestScore = async () => {
      try {
        // Only fetch if we have a real reason (score > 0 to avoid initial clutter)
        const response = await axios.get(baseURL);
        if (response.data.bestScore < score) {
          const newBestScore = { bestScore: score };
          const res = await axios.patch(
            baseURL + "/" + response.data._id,
            newBestScore
          );
          console.log("bestScore updated:", res.data);
          setBestScore(res.data.bestScore);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error updating score:", error);
        setIsConnected(false);
      }
    };

    const timer = setTimeout(() => {
      if (score > 0) {
        checkAndUpdateBestScore();
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [score]);


  useEffect(() => {
    initializeGrid();
    initializeBestScore();
  }, []);

  const handleNew = (e) => {
    e.preventDefault();
    resetGrid();
  };
  const handleUndo = (e) => {
    e.preventDefault();
    setGrid(previousGrid);
    setPreviousGrid(grid);
    setScore(previousScore);
    setIsGameOver(false); // Reset game over on undo
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent handling if menu is open or game is over
      if (showDevMenu || isGameOver) return;

      handle(
        e.code,
        grid,
        score,
        previousGrid,
        previousScore,
        movesCount,
        setGrid,
        setScore,
        setPreviousGrid,
        setPreviousScore,
        setMovesCount
      );
    };
    
    // Check for game over state AFTER grid updates (or purely based on current grid state)
    // Note: 'handle' updates the grid state asynchronously.
    // We should probably check game over in a separate useEffect responding to [grid]
    
    document.onkeydown = handleKeyDown;
    return () => {
      document.onkeydown = null;
    };
  }, [grid, score, previousGrid, previousScore, movesCount, showDevMenu, isGameOver]);

  // Separate effect to check for game over whenever grid changes
  useEffect(() => {
   if (checkGameOver(grid) && score > 0) {
      setIsGameOver(true);
   }
  }, [grid]);


  return (
    <>
      <div className="container">
        <div className="game-window">
          <Header
            score={score}
            bestScore={bestScore}
            isConnected={isConnected}
            handleNew={handleNew}
            handleUndo={handleUndo}
          ></Header>
          <Info />
          <Board grid={grid}>
             <GameOverModal isGameOver={isGameOver} score={score} onRetry={resetGrid} />
          </Board>
          <Footer movesCount={movesCount} startTime={startTime} isConnected={isConnected} />
        </div>
        <button
          onClick={() => setShowDevMenu(true)}
          className="dev-wrench-btn"
          title="Developer Roadmap & Logs"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
          </svg>
        </button>
      </div>
      {showDevMenu && <DeveloperMenu onClose={() => setShowDevMenu(false)} />}
    </>
  );
};
export default App;
