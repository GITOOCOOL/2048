import React from 'react'
import Timer from './Timer'
const Footer = ({movesCount, startTime, isConnected}) => {
  return (
    <div className="footer">
        <div className="movesdisplay">{movesCount} moves</div>

        <div className="status-container-inline">
          <div className={isConnected ? "status-dot online" : "status-dot offline"}></div>
          <span className={isConnected ? "status-text online-text" : "status-text offline-text"}>
            {isConnected ? "online" : "offline"}
          </span>
        </div>

        <Timer startTime={startTime}/>
    </div>

  )
}

export default Footer