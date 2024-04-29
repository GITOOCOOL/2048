import React from 'react'
import Timer from './Timer'
const Footer = ({movesCount, startTime}) => {
  return (
    <div className="footer">
        <div className="movesdisplay">{movesCount} moves</div>
        <Timer startTime={startTime}/>
    </div>

  )
}

export default Footer