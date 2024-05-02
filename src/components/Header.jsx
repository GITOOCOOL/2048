import React from 'react'

const Header = ({score, bestScore, isConnected, handleNew, handleUndo}) => {
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
          <div className="scoreboard">
              <span className="scoretext">best</span>
              <span id="score">{isConnected? bestScore : 'loading...'}</span>
          </div>
          <button className="btn btn-undo" onClick={handleUndo}><div className="btn-label">undo</div></button>
        </div>
    </div>
  )
}

export default Header