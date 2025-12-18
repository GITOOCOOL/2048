import React from "react";
import Board from "./Board";
import Header from "./Header";
import Footer from "./Footer";
import Info from "./Info";
import GameOverModal from "./GameOverModal";
import { useBestScore } from "../hooks/useBestScore";
import { useGame } from "../hooks/useGame";

const Game = ({ game, bestScore, globalBestScore, isConnected }) => {
  // Game logic is now lifted to App.jsx
  // const game = useGame({ showDevMenu, onReset: null }); // Removed calling hook here
  // const { bestScore, globalBestScore, isConnected, initializeBestScore } = useBestScore(game.score, user); // Removed calling hook here
  
  return (
    <div className="game-window">
      <Header
        score={game.score}
        bestScore={bestScore}
        globalBestScore={globalBestScore}
        isConnected={isConnected}
        handleNew={game.handleNew}
        handleUndo={game.handleUndo}
      />
      <Info />
      <Board grid={game.grid}>
        <GameOverModal isGameOver={game.isGameOver} score={game.score} onRetry={game.resetGrid} />
      </Board>
      <Footer movesCount={game.movesCount} startTime={game.startTime} isConnected={isConnected} />
    </div>
  );
};

export default Game;
