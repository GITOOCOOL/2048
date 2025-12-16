import React from 'react';

const GameOverModal = ({ isGameOver, score, onRetry }) => {
  if (!isGameOver) return null;

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1>Game Over!</h1>
        <p>Final Score: {score}</p>
        <button className="btn-retry" onClick={onRetry}>Try Again</button>
      </div>
    </div>
  );
};

export default GameOverModal;
