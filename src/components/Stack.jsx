import React from 'react'
import Cell from './Cell'

const Stack = ({stack}) => {
  return (
    <div className="stack">
        <Cell tile={stack[0]}></Cell>
        <Cell tile={stack[1]}></Cell>
        <Cell tile={stack[2]}></Cell>
        <Cell tile={stack[3]}></Cell>
    </div>
  )
}

export default Stack