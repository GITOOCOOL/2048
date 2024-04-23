import React, { useEffect } from 'react'
import { useState } from 'react'

const Cell = (props) => {
    const [tile,setTile] = useState(props.tile)
    useEffect(() =>{
        setTile(props.tile)
    },[])
  return (
    <div className="cell">
        <div className={'tile'+ props.tile + ' tile'}>{props.tile}</div>
    </div>
  )
}

export default Cell