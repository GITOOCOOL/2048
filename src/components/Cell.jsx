import React, { useEffect } from 'react'

const Cell = ({tile}) => {
  return (
    <div className="cell">
        <div className={'tile'+ tile + ' tile'}>{tile}</div>
    </div>
  )
}

export default Cell