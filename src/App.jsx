import { useEffect, useState, useCallback, useRef } from 'react';
import './App.css'

import Cell from './Cell';
const App = () => {
  const [tiles, setTiles] = useState([])
  // const [keypressed, setkeypressed] = useState(false)

  const updateTiles = () => {
    if(tiles.length === 0 ) {
      initializeTilesWith2RandomTiles();
    }
    else {
      setTiles(tiles);
    }
  }

  const rightMove = () => {
    let tempTiles = tiles;
    let sortedTiles = tempTiles.sort((a,b) => a-b)
    sortedTiles = sortedTiles.map((t) => t*2)

    // for(let i = 0; i < sortedTiles.length-1; i++) {
    //   if(sortedTiles[i+1] === sortedTiles[i]) {
    //     sortedTiles[i+1] = sortedTiles[i]*2;
    //     sortedTiles[i] = 0;
    //   }
    // }
    setTiles(sortedTiles);
    console.log(`tiles: ${tiles}`);
  }

  const leftMove = () => {
    console.log('leftMove');
    let tempTiles = tiles;
    let sortedTiles = tempTiles.sort((a,b) => b-a)
    // for(let i = 0; i < tempTiles.length-1; i++) {
    //   if(tempTiles[i+1] === tempTiles[i]) {
    //     tempTiles[i+1] = tempTiles[i]*2;
    //     tempTiles[i] = 0;
    //   }
    // }
    // console.log(sortedTiles);
    setTiles(sortedTiles);
    console.log(`tiles: ${tiles}`);
  }


  //only runs on first render
  useEffect(() => {
    console.log('I only run once');
    updateTiles();
    console.log('first render: ', tiles)
  },[]);

  // I run on every render
  useEffect(() => {
    console.log('I run on every render');
    updateTiles();
    console.log('every render:', tiles)
  },[]);


  const initializeTilesWith2RandomTiles = () => {
    
      let randpos1 = Math.floor(Math.random() * 4);
      let randpos2 = Math.floor(Math.random() * 4);
      // console.log(randpos1)
      // console.log(randpos2)
      let tmp = [0,0,0,0];
      tmp[randpos1] = 2
      tmp[randpos2] = 2
      setTiles(tmp);

  }




  document.onkeydown = (e) => {
    // setkeypressed(!keypressed)
    if (e.code === 'ArrowRight') {
      handleRight();
    }
    if (e.code === 'ArrowLeft') {
      handleLeft();
    }
  }

//rather than sorted tiles must use shifted tiles but for now I am using sortedTiles till I get the selectedEmptyTiles logic right
//Now I sloved the selected emptyTiles logic right
  const handleLeft = () => {
    // e.preventDefault();
    let tempTiles = tiles;
    let sortedTiles = tempTiles.sort((a,b) => b-a)
    // sortedTiles = sortedTiles.map((t) => t*2)
    for(let i = 0; i < sortedTiles.length-1; i++) {
      if(sortedTiles[i+1] === sortedTiles[i]) {
        sortedTiles[i+1] = sortedTiles[i]*2;
        sortedTiles[i] = 0;
      }
    }
    sortedTiles.sort((a,b) => b-a)
    setTiles(sortedTiles.map((t) => t));
    // generateNew2()
    //find empty cells
    let emptyCells = [];
    for(let i = 0; i <sortedTiles.length; i++){
      if(sortedTiles[i] === 0){
        emptyCells.push(i)
      }
    }

    console.log('emptyCells: ', emptyCells);

    
    //randomly select an empty cell and populate it with 2

    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
    console.log('selectedEmptyCell: ', selectedEmptyCell);
    sortedTiles[emptyCells[selectedEmptyCell]] = 2;

    setTiles(sortedTiles.map(t => t))

    console.log(`tiles: ${tiles}`);
  }
  const handleRight = () => {
    // e.preventDefault();
    let tempTiles = tiles;
    let sortedTiles = tempTiles.sort((a,b) => a-b)
    // sortedTiles = sortedTiles.map((t) => t*2)
    for(let i = 0; i < sortedTiles.length-1; i++) {
      if(sortedTiles[i+1] === sortedTiles[i]) {
        sortedTiles[i+1] = sortedTiles[i]*2;
        sortedTiles[i] = 0;
      }
    }
    sortedTiles.sort((a,b) => a-b)
    setTiles(sortedTiles.map((t) => t));
    // generateNew2()
    //find empty cells
    let emptyCells = [];
    for(let i = 0; i <sortedTiles.length; i++){
      if(sortedTiles[i] === 0){
        emptyCells.push(i)
      }
    }

    console.log('emptyCells: ', emptyCells);

    
    //randomly select an empty cell and populate it with 2

    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
    console.log('selectedEmptyCell: ', selectedEmptyCell);
    sortedTiles[emptyCells[selectedEmptyCell]] = 2;

    setTiles(sortedTiles.map(t => t))

    console.log(`tiles: ${tiles}`);
  }
  
    

  return (
    <div>
      <div className="grid">
        <Cell tile={tiles[0]} id="0"></Cell>
        <Cell tile={tiles[1]} id="1"></Cell>
        <Cell tile={tiles[2]} id="2"></Cell>
        <Cell tile={tiles[3]} id="3"></Cell>
      </div>
      <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button>
    </div>
  )
}

export default App