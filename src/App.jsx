import { useEffect, useState } from 'react';
import './App.css'

import Stack from './Stack';

const App = () => {
  const [grid, setGrid] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
  // const [grid, setGrid] = useState([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]])

  const updateGrid = () => {

    
    //if grid is empty then initialize two random tiles with 2
    
    // reducing the grid to a single sum
    let sumOfAllTiles = grid.map((stack)=> stack.reduce((acc, tile) => acc + tile)).reduce((acc, number) => acc + number)
    
    if(sumOfAllTiles === 0 ){
      /* Initializing the grid with 2 random tiles with value of 2*/
          let randpos1x = Math.floor(Math.random() * 4);
          let randpos1y = Math.floor(Math.random() * 4);
          let randpos2x = Math.floor(Math.random() * 4);
          let randpos2y = Math.floor(Math.random() * 4);
          let tmp = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
          tmp[randpos1x][randpos1y] = 2
          tmp[randpos2x][randpos2y] = 2
          setGrid(tmp);

    }
    else{
      setGrid(grid);
    }
  }

  useEffect(() => {
    updateGrid();
  },[]);


  document.onkeydown = (e) => {
    handle(e.code)
  }

  const rotateGrid = () => {
    let temp1 = grid.map(stack => stack.map(tile => tile))
    let temp2 = grid.map(stack => stack.map(tile => tile))

    console.log('original:', grid )
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[j][i];
      }
    }
    return temp1;
  }

  // I already figured out how to do leftMove and rightMove in the 1D version
  // To be able to do upMove and downMove in the 2D version, I need to figure out the way to transform the grid or more correctly rotate the grid clockwise and counter clockwise and the same version of the leftMove and rightMove can be used on the transformed grid. Then finally I can reverse the transformation and get the desired result.

  //




  // Now I need to update the handle function to incorporate the key up down and the whole 2D sheninigans
  const handle = (key) => {
    //Rather than using the condition for just left and right, I will use a switch case statement for each key presses

    switch (key) {
      case 'ArrowLeft':
      {
        // trying to make an array of stacks with at least one empty tile
          let stacksWithAtLeastOneEmptyTile = [];
          for(let i = 0; i < grid.length; i++){

            if(grid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
              stacksWithAtLeastOneEmptyTile.push(i)
            }

          }
          let randomStackToGenerateNewTile = stacksWithAtLeastOneEmptyTile[Math.floor(Math.random() * stacksWithAtLeastOneEmptyTile.length)]
          console.log('stackWithAtLeastOneEmptyTile: ', stacksWithAtLeastOneEmptyTile)
          console.log('randomStackToGenerate: ', randomStackToGenerateNewTile)


          let tempGrid = grid.map(stack => stack.map(tile=> tile))
          tempGrid = tempGrid.map((stack,index=0)=> {
              let tempStack = stack
              let populatedTiles = tempStack.filter(tile => tile>0)
              
              for(let i = 0; i < 4; i++){
                if(i < populatedTiles.length){
                  continue; //
                }
                else {
                  populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
                }
              }
              
              // logic to merge two tiles with the same values
              let shiftedStack = populatedTiles;
              for(let i = 0; i < shiftedStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                if(shiftedStack[i+1] === shiftedStack[i]) {
                  shiftedStack[i] *= 2
                  shiftedStack[i+1] = 0;
                }
              }
              
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              shiftedStack = shiftedStack.filter(t => t > 0)
              
              for(let i = 0; i < 4; i++){
                if(i < shiftedStack.length){
                  continue; //
                }
                else {
                  shiftedStack.push(0)
                }
              }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
                if(index === randomStackToGenerateNewTile){
                  let emptyCells = [];
                    for(let i = 0; i <shiftedStack.length; i++){
                      if(shiftedStack[i] === 0){
                        emptyCells.push(i)
                      }
                    }
                    //randomly select an empty cell and populate it with 2
                    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
                    shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              }
              
              // also need to reverse at the end to get the correct tiles
              // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // console.log('asdf: ',shiftedStack);
              index++;
              return shiftedStack
          })
          console.log('updated grid:', tempGrid);
          setGrid(tempGrid);
          // console.log(grid)
    }
      break;
      case 'ArrowRight': 
      {   
          let tempGrid = grid.map(stack => stack.reverse().map(tile=> tile))

        // trying to make an array of stacks with at least one empty tile
          let stacksWithAtLeastOneEmptyTile = [];
          for(let i = 0; i < tempGrid.length; i++){

            if(tempGrid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
              stacksWithAtLeastOneEmptyTile.push(i)
            }

          }
          let randomStackToGenerateNewTile = stacksWithAtLeastOneEmptyTile[Math.floor(Math.random() * stacksWithAtLeastOneEmptyTile.length)]
          console.log('stackWithAtLeastOneEmptyTile: ', stacksWithAtLeastOneEmptyTile)
          console.log('randomStackToGenerate: ', randomStackToGenerateNewTile)


          tempGrid = tempGrid.map((stack,index=0)=> {
              let tempStack = stack
              let populatedTiles = tempStack.filter(tile => tile>0)
              console.log(populatedTiles);
              
              for(let i = 0; i < 4; i++){
                if(i < populatedTiles.length){
                  continue; //
                }
                else {
                  populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
                }
              }
              
              // logic to merge two tiles with the same values
              let shiftedStack = populatedTiles;
              for(let i = 0; i < shiftedStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                if(shiftedStack[i+1] === shiftedStack[i]) {
                  shiftedStack[i] *= 2
                  shiftedStack[i+1] = 0;
                }
              }
              
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              shiftedStack = shiftedStack.filter(t => t > 0)
              
              for(let i = 0; i < 4; i++){
                if(i < shiftedStack.length){
                  continue; //
                }
                else {
                  shiftedStack.push(0)
                }
              }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
                if(index === randomStackToGenerateNewTile){
                  let emptyCells = [];
                    for(let i = 0; i <shiftedStack.length; i++){
                      if(shiftedStack[i] === 0){
                        emptyCells.push(i)
                      }
                    }
                    //randomly select an empty cell and populate it with 2
                    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
                    shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              }
              
              // also need to reverse at the end to get the correct tiles
              // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // console.log('asdf: ',shiftedStack);
              index++;
              return shiftedStack.reverse();
          })
          console.log('updated grid:', tempGrid);
          setGrid(tempGrid);
      }
      break;


      case 'ArrowUp': {

        let rotatedGrid = rotateGrid();
        // let rotatedGrid = temp1.map(stack => stack)

        console.log('rotatedGrid now:', rotatedGrid )



        // trying to make an array of stacks with at least one empty tile

          let stacksWithAtLeastOneEmptyTile = [];
          for(let i = 0; i < rotatedGrid.length; i++){

            if(rotatedGrid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
              stacksWithAtLeastOneEmptyTile.push(i)
            }

          }
          let randomStackToGenerateNewTile = stacksWithAtLeastOneEmptyTile[Math.floor(Math.random() * stacksWithAtLeastOneEmptyTile.length)]
          console.log('stackWithAtLeastOneEmptyTile: ', stacksWithAtLeastOneEmptyTile)
          console.log('randomStackToGenerate: ', randomStackToGenerateNewTile)


          let tempGrid = rotatedGrid.map(stack => stack.map(tile=> tile))
          tempGrid = tempGrid.map((stack,index=0)=> {
              let tempStack = stack
              let populatedTiles = tempStack.filter(tile => tile>0)
              
              for(let i = 0; i < 4; i++){
                if(i < populatedTiles.length){
                  continue; //
                }
                else {
                  populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
                }
              }
              
              // logic to merge two tiles with the same values
              let shiftedStack = populatedTiles;
              for(let i = 0; i < shiftedStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                if(shiftedStack[i+1] === shiftedStack[i]) {
                  shiftedStack[i] *= 2
                  shiftedStack[i+1] = 0;
                }
              }
              
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              shiftedStack = shiftedStack.filter(t => t > 0)
              
              for(let i = 0; i < 4; i++){
                if(i < shiftedStack.length){
                  continue; //
                }
                else {
                  shiftedStack.push(0)
                }
              }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
                if(index === randomStackToGenerateNewTile){
                  let emptyCells = [];
                    for(let i = 0; i <shiftedStack.length; i++){
                      if(shiftedStack[i] === 0){
                        emptyCells.push(i)
                      }
                    }
                    //randomly select an empty cell and populate it with 2
                    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
                    shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              }
              
              // also need to reverse at the end to get the correct tiles
              // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // console.log('asdf: ',shiftedStack);
              index++;
              return shiftedStack
          })
          console.log('updated grid:', tempGrid);

          let temp3 = tempGrid.map(stack => stack.map(tile => tile))
          let temp4 = tempGrid.map(stack => stack.map(tile => tile))

          console.log('original:', grid )
          for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
              temp3[i][j] = temp4[j][i];
            }
          }
          let rotatedGrid1 = temp3.map(stack => stack)

          console.log('rotatedGrid now:', rotatedGrid )
          setGrid(rotatedGrid1);

        
      }

      break;
      case 'ArrowDown': 
      {

        let temp1 = grid.map(stack => stack.map(tile => tile))
        let temp2 = grid.map(stack => stack.map(tile => tile))

        console.log('original:', grid )
        for(let i=0; i<4; i++){
          for(let j=0; j<4; j++){
            temp1[i][j] = temp2[j][3-i];
          }
        }
        let rotatedGrid = temp1.map(stack => stack)

        console.log('rotatedGrid now:', rotatedGrid )



        // trying to make an array of stacks with at least one empty tile

          let stacksWithAtLeastOneEmptyTile = [];
          for(let i = 0; i < rotatedGrid.length; i++){

            if(rotatedGrid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
              stacksWithAtLeastOneEmptyTile.push(i)
            }

          }
          let randomStackToGenerateNewTile = stacksWithAtLeastOneEmptyTile[Math.floor(Math.random() * stacksWithAtLeastOneEmptyTile.length)]
          console.log('stackWithAtLeastOneEmptyTile: ', stacksWithAtLeastOneEmptyTile)
          console.log('randomStackToGenerate: ', randomStackToGenerateNewTile)


          let tempGrid = rotatedGrid.map(stack => stack.map(tile=> tile))
          tempGrid = tempGrid.map((stack,index=0)=> {
              let tempStack = stack
              let populatedTiles = tempStack.filter(tile => tile>0).reverse();
              
              for(let i = 0; i < 4; i++){
                if(i > populatedTiles.length){
                  
                  continue; //
                }
                else {
                  populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
                }
              }
              
              // logic to merge two tiles with the same values
              let shiftedStack = populatedTiles;
              for(let i = 0; i < shiftedStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                if(shiftedStack[i-1] === shiftedStack[i]) {
                  shiftedStack[i] *= 2
                  shiftedStack[i-1] = 0;
                }
              }
              
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              shiftedStack = shiftedStack.filter(t => t > 0)
              
              for(let i = 0; i < 4; i++){
                if(i < shiftedStack.length){
                  continue; //
                }
                else {
                  shiftedStack.push(0)
                }
              }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
                if(index === randomStackToGenerateNewTile){
                  let emptyCells = [];
                    for(let i = 0; i <shiftedStack.length; i++){
                      if(shiftedStack[i] === 0){
                        emptyCells.push(i)
                      }
                    }
                    //randomly select an empty cell and populate it with 2
                    let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
                    shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              }
              
              // also need to reverse at the end to get the correct tiles
              // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // console.log('asdf: ',shiftedStack);
              index++;
              return shiftedStack
          })
          console.log('updated grid:', tempGrid);

          let temp3 = tempGrid.map(stack => stack.map(tile => tile))
          let temp4 = tempGrid.map(stack => stack.map(tile => tile))

          console.log('original:', grid )
          for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
              temp3[i][j] = temp4[3-j][i];
            }
          }
          let rotatedGrid1 = temp3.map(stack => stack)

          console.log('rotatedGrid now:', rotatedGrid )
          setGrid(rotatedGrid1.reverse());

        
      }
      break;
        default: break;
    }


    // let populatedTiles = tempTiles.filter(t => t > 0)

    // for(let i = 0; i < 4; i++){
    //   if(i < populatedTiles.length){
    //     continue; //
    //   }
    //   else {
    //     populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
    //   }
    // }

    // logic to merge two tiles with the same values
    // let shiftedTiles = populatedTiles;
    // for(let i = 0; i < shiftedTiles.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
    //   if(shiftedTiles[i+1] === shiftedTiles[i]) {
    //     shiftedTiles[i] *= 2
    //     shiftedTiles[i+1] = 0;
    //   }
    // }

    // after we merged the tiles, we need to shift the tiles again
    // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
    // maybe after this I should try to extract the shifting function to make the code more modular
    // shiftedTiles = shiftedTiles.filter(t => t > 0)

    // for(let i = 0; i < 4; i++){
    //   if(i < shiftedTiles.length){
    //     continue; //
    //   }
    //   else {
    //     shiftedTiles.push(0)
    //   }
    // }


    // I don't know why I put this code here, but it maybe because the rerendiring didn't work in chrome and I was trying to force re-rendering, however in safari the code seems to work fine without the below codes
    // shiftedTiles.sort((a,b) => b-a)
    // setTiles(shiftedTiles.map((t) => t));


    // Generating new 2 numbered tiles logic
    // generateNew2()
    //find empty cells
    // let emptyCells = [];
    // for(let i = 0; i <shiftedTiles.length; i++){
    //   if(shiftedTiles[i] === 0){
    //     emptyCells.push(i)
    //   }
    // }
    // //randomly select an empty cell and populate it with 2
    // let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
    // shiftedTiles[emptyCells[selectedEmptyCell]] = 2;

    // // also need to reverse at the end to get the correct tiles
    // setTiles(key==='ArrowLeft'?shiftedTiles.map((t)=>t):shiftedTiles.map(t => t).reverse())
    

  }
  
  
    // Now lets try to make this into 4 by 4 grid rather than a single stack
    // for that I need to use a 2D array for the tiles state
    // maybe some basic refactoring is needed for the naming of the classes, like grid should be renamed to board. I will do that right away
    // The next childrens of the board must be called Stack to represent the rows and should contain 4 cells within them.

  return (
    <div>
      <div className="board">
        <Stack stack={grid[0]}></Stack>
        <Stack stack={grid[1]}></Stack>
        <Stack stack={grid[2]}></Stack>
        <Stack stack={grid[3]}></Stack>
       </div>
    </div>
  )
}

export default App