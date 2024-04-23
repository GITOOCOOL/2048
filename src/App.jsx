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
    let shiftedTiles = tempTiles.sort((a,b) => a-b)
    shiftedTiles = shiftedTiles.map((t) => t*2)

    // for(let i = 0; i < shiftedTiles.length-1; i++) {
    //   if(shiftedTiles[i+1] === shiftedTiles[i]) {
    //     shiftedTiles[i+1] = shiftedTiles[i]*2;
    //     shiftedTiles[i] = 0;
    //   }
    // }
    setTiles(shiftedTiles);
    console.log(`tiles: ${tiles}`);
  }

  const leftMove = () => {
    console.log('leftMove');
    let tempTiles = tiles;
    let shiftedTiles = tempTiles.sort((a,b) => b-a)
    // for(let i = 0; i < tempTiles.length-1; i++) {
    //   if(tempTiles[i+1] === tempTiles[i]) {
    //     tempTiles[i+1] = tempTiles[i]*2;
    //     tempTiles[i] = 0;
    //   }
    // }
    // console.log(shiftedTiles);
    setTiles(shiftedTiles);
    console.log(`tiles: ${tiles}`);
  }


 


  useEffect(() => {
    console.log('I run on first render');
    updateTiles();
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

//rather than sorted tiles must use shifted tiles but for now I am using shiftedTiles till I get the selectedEmptyTiles logic right
//Now I sloved the selected emptyTiles logic right
// Now I shall start working on the shifting logic
// First change the shortedTiles array to shiftedArray
  const handleLeft = () => {
    // e.preventDefault();
    let tempTiles = tiles;
    // maybe just iterate over the tiles and push only the populated tiles to a temporary array then at last just push 0's at the end to make it a 1by4 array that will shift the array easily


    let populatedTiles = tempTiles.filter(t => t > 0)
    console.log('length', populatedTiles.length);

    for(let i = 0; i < 4; i++){
      if(i < populatedTiles.length){
        continue; //
      }
      else {
        populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
      }
    }

    // logic to merge two tiles with the same values
    let shiftedTiles = populatedTiles;
    for(let i = 0; i < shiftedTiles.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
      if(shiftedTiles[i+1] === shiftedTiles[i]) {
        shiftedTiles[i] *= 2
        shiftedTiles[i+1] = 0;
      }
    }

    // after we merged the tiles, we need to shift the tiles again
    // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
    // maybe after this I should try to extract the shifting function to make the code more modular
    shiftedTiles = shiftedTiles.filter(t => t > 0)

    for(let i = 0; i < 4; i++){
      if(i < shiftedTiles.length){
        continue; //
      }
      else {
        shiftedTiles.push(0)
      }
    }


    // I don't know why I put this code here, but it maybe because the rerendiring didn't work in chrome and I was trying to force re-rendering, however in safari the code seems to work fine without the below codes
    // shiftedTiles.sort((a,b) => b-a)
    // setTiles(shiftedTiles.map((t) => t));


    // Generating new 2 numbered tiles logic
    // generateNew2()
    //find empty cells
    let emptyCells = [];
    for(let i = 0; i <shiftedTiles.length; i++){
      if(shiftedTiles[i] === 0){
        emptyCells.push(i)
      }
    }
    //randomly select an empty cell and populate it with 2
    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
    shiftedTiles[emptyCells[selectedEmptyCell]] = 2;

    setTiles(shiftedTiles.map(t => t))

  }

  // For handleRight I will just reverse the logic of handleLeft
  // For optimization I am thinking of creating a single handle function that can switch roles based on the arrows input , getting rid of individual functions for each arrow press, but that is left for later update
  const handleRight = () => {
    // e.preventDefault();

    // thankfully, just reversing the tiles array works 
    let tempTiles = tiles.reverse();
    // maybe just iterate over the tiles and push only the populated tiles to a temporary array then at last just push 0's at the end to make it a 1by4 array that will shift the array easily


    let populatedTiles = tempTiles.filter(t => t > 0)
    console.log('length', populatedTiles.length);

    for(let i = 0; i < 4; i++){
      if(i < populatedTiles.length){
        continue; //
      }
      else {
        populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
      }
    }

    // logic to merge two tiles with the same values
    let shiftedTiles = populatedTiles;
    for(let i = 0; i < shiftedTiles.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
      if(shiftedTiles[i+1] === shiftedTiles[i]) {
        shiftedTiles[i] *= 2
        shiftedTiles[i+1] = 0;
      }
    }

    // after we merged the tiles, we need to shift the tiles again
    // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
    // maybe after this I should try to extract the shifting function to make the code more modular
    shiftedTiles = shiftedTiles.filter(t => t > 0)

    for(let i = 0; i < 4; i++){
      if(i < shiftedTiles.length){
        continue; //
      }
      else {
        shiftedTiles.push(0)
      }
    }


    // I don't know why I put this code here, but it maybe because the rerendiring didn't work in chrome and I was trying to force re-rendering, however in safari the code seems to work fine without the below codes
    // shiftedTiles.sort((a,b) => b-a)
    // setTiles(shiftedTiles.map((t) => t));


    // Generating new 2 numbered tiles logic
    // generateNew2()
    //find empty cells
    let emptyCells = [];
    for(let i = 0; i <shiftedTiles.length; i++){
      if(shiftedTiles[i] === 0){
        emptyCells.push(i)
      }
    }
    //randomly select an empty cell and populate it with 2
    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
    shiftedTiles[emptyCells[selectedEmptyCell]] = 2;

    // also need to reverse at the end to get the correct tiles
    setTiles(shiftedTiles.map(t => t).reverse())

  }
  
  
    

  return (
    <div>
      <div className="grid">
        <Cell tile={tiles[0]} id="0"></Cell>
        <Cell tile={tiles[1]} id="1"></Cell>
        <Cell tile={tiles[2]} id="2"></Cell>
        <Cell tile={tiles[3]} id="3"></Cell>
      </div>
      {/* <button onClick={handleLeft}>left</button>
      <button onClick={handleRight}>right</button> */}
    </div>
  )
}

export default App