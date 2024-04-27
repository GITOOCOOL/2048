import { useState, useEffect } from 'react';
import Stack from './Stack'

const Board = ({grid}) => {


  return (
    <div className="board">
        <Stack stack={grid[0]}></Stack>
        <Stack stack={grid[1]}></Stack>
        <Stack stack={grid[2]}></Stack>
        <Stack stack={grid[3]}></Stack>
    </div>
  )
}

export default Board