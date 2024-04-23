import React, { useEffect } from 'react'
import { useState } from 'react'

const Cell = ({tile}) => {
    // const [number,setNumber] = useState(tile)
    // useEffect(() =>{
    //     setTile(tile)
    // },[])
    // console.log(props.tile)
  return (
    <div className="cell">
        <div className={'tile'+ tile + ' tile'}>{tile}</div>
    </div>
  )
}

export default Cell