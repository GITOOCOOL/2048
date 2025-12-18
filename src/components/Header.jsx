import React from 'react'

const Header = ({score, bestScore, globalBestScore, isConnected, handleNew, handleUndo}) => {
  return (
    <div className="header">
        <div className="col col1">
          <div className="logo">
              <span>2048</span>
          </div>
        </div>
        <div className="col col2">
          <div className="scoreboard">
              <span className="scoretext">score</span>
              <span id="score">{score}</span>
          </div>
          <button className="btn btn-new" onClick={handleNew}><div className="btn-label">new</div></button>
        </div>
        <div className="col col3">
          <div className="dual-score-container">
            <div className="mini-scoreboard">
                <span className="scoretext-mini">your best</span>
                <span id="score-mini">{isConnected? bestScore : '...'}</span>
            </div>
            <div className="mini-scoreboard">
                <span className="scoretext-mini" style={{ color: '#f9f6f2' }}>world</span>
                <span id="score-mini">{isConnected? globalBestScore : '...'}</span>
            </div>
          </div>
          <button className="btn btn-undo" onClick={handleUndo}><div className="btn-label">undo</div></button>
        </div>
    </div>
  )
}

export default Header