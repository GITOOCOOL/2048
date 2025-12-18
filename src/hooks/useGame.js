import { useState, useEffect, useRef } from "react";
import { checkGameOver } from "../utils/gameOverLogic";
import { handle } from "../utils/handlers";
import { useSound } from "./useSound";

const initializeGrid = () => {
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

export const useGame = ({ showDevMenu, onReset }) => {
  const [grid, setGrid] = useState(initializeGrid());
  const [movesCount, setMovesCount] = useState(0);
  const [previousGrid, setPreviousGrid] = useState(grid);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Audio System
  const { playMove, playMerge, playGameOver, playClick, settings, updateSetting } = useSound();
  
  // Track previous state for sound triggers
  const prevScoreRef = useRef(score);
  const prevGridRef = useRef(grid);

  const resetGrid = () => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setPreviousGrid(newGrid);
    setMovesCount(0);
    setScore(0);
    setPreviousScore(0);
    setStartTime(Date.now());
    setIsGameOver(false);
    playClick(); // Sound feedback
    if (onReset) onReset();
  };

  const handleUndo = (e) => {
    e.preventDefault();
    setGrid(previousGrid);
    setPreviousGrid(grid);
    setScore(previousScore);
    setIsGameOver(false);
    playClick();
  };
  
  // Sound Effects Logic
  useEffect(() => {
      const gainedPoints = score - prevScoreRef.current;
      
      // If score increased, it was a merge
      if (gainedPoints > 0) {
          // If multiple merges (e.g. 4+8=12), we play the sound for the "approximate" dominant tile
          // or just pass it through. The synth handles defaults gracefully.
          playMerge(gainedPoints);
      } else if (grid !== prevGridRef.current && movesCount > 0) {
          playMove();
      }
      
      prevScoreRef.current = score;
      prevGridRef.current = grid;
  }, [grid, score, movesCount, playMerge, playMove]);

  // Move Logic
  const move = (direction) => {
      if (showDevMenu || isGameOver) return;
       handle(
        direction, grid, score, previousGrid, previousScore, movesCount,
        setGrid, setScore, setPreviousGrid, setPreviousScore, setMovesCount
      );
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      move(e.code);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [grid, score, previousGrid, previousScore, movesCount, showDevMenu, isGameOver]);

  // Game over check
  useEffect(() => {
    if (checkGameOver(grid) && score > 0) {
      if (!isGameOver) playGameOver(); // Play once
      setIsGameOver(true);
    }
  }, [grid, score]);

  return {
    grid, score, movesCount, startTime, isGameOver,
    resetGrid, handleUndo, move,
    handleNew: (e) => { e.preventDefault(); resetGrid(); },
    // Settings & Sound
    settings, updateSetting, playClick
  };
};