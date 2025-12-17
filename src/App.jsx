import { useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./components/Info";
import DeveloperMenu from "./components/DeveloperMenu";
import GameOverModal from "./components/GameOverModal";

import { useBestScore } from "./hooks/useBestScore";
import { useGame } from "./hooks/useGame";

const App = () => {
  const [showDevMenu, setShowDevMenu] = useState(false);
  const game = useGame({ showDevMenu, onReset: null });
  const { bestScore, isConnected, initializeBestScore } = useBestScore(game.score);
  // Connect reset callback
  game.onReset = initializeBestScore;
  return (
    <>
      <div className="container">
        <div className="game-window">
          <Header
            score={game.score}
            bestScore={bestScore}
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
        <button onClick={() => setShowDevMenu(true)} className="dev-wrench-btn" title="Developer Roadmap & Logs">
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