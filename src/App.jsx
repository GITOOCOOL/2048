import { useEffect, useState } from 'react';
import './App.css'

import Stack from './Stack';
import Updates from './Updates';

const App = () => {
  const [movesCount, setMovesCount] = useState(-2);
  const [timer, setTimer] = useState('00:00');
  const [grid, setGrid] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
  // const [grid, setGrid] = useState([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]])
  const [previousGrid, setPreviousGrid] = useState(grid)
  const [score, setScore] = useState(0)
  const [previousScore, setPreviousScore] = useState(score)
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

  const resetGrid = () => {
    let temp = grid.map(stack=>stack)
    for(let i=0; i<grid.length; i++){
      grid[i] = [0,0,0,0]
    }
    setGrid(temp)
    updateGrid()
  }

  useEffect(() => {
    updateGrid();
  },[]);

  useEffect(() =>{setMovesCount(movesCount+1)},[grid]);

  const handleNew = (e)=>{
    e.preventDefault();
    resetGrid();
    // setPreviousGrid(grid);
    setPreviousScore(0);
    setScore(0);
    setMovesCount(0)

    console.log(grid)
    // updateGrid();
  }
  const handleUndo = (e)=>{
    e.preventDefault();
    setGrid(previousGrid);
    setScore(previousScore);

    console.log(grid)
    // updateGrid();
  }


  document.onkeydown = (e) => {
    handle(e.code)
  }
const reverseGrid = (gridToReverse) => {
    let temp1 = gridToReverse.map(stack => stack.map(tile => tile))
    let temp2 = gridToReverse.map(stack => stack.map(tile => tile))

    console.log('original:', gridToReverse.flat().toString() )
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[i][3-j];
      }
    }
    console.log('reversed:', temp1.flat().toString() )
    return temp1;
}
  const rotateGridUp = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = gridToRotate.map(stack => stack.map(tile => tile))

    console.log('original:', gridToRotate.flat().toString() )
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[j][i];
      }
    }
    console.log('rotatedUp:', temp1.flat().toString() )
    return temp1;
  }
  const rotateGridDown = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = grid.map(stack => stack.map(tile => tile))

    console.log('original:', grid.flat().toString() )
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[3-j][i];
      }
    }
    return temp1;
  }
  const rotateGridDownInverse = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = gridToRotate.map(stack => stack.map(tile => tile))

    console.log('original:', grid )
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[j][3-i];
      }
    }
    return temp1;
  }

  // I already figured out how to do leftMove and rightMove in the 1D version
  // To be able to do upMove and downMove in the 2D version, I need to figure out the way to transform the grid or more correctly rotate the grid clockwise and counter clockwise and the same version of the leftMove and rightMove can be used on the transformed grid. Then finally I can reverse the transformation and get the desired result.


  // Now I need to update the handle function to incorporate the key up down and the whole 2D sheninigans


  // While testing I found one issue: Because I implemented checking if the stackWithAtLeastOneEmptyTile to check if there is any empty tile in the stack and based on that I marked the stack as eligible for generating a new tile. But in case a tile has empty tiles but all to the end, i.e. while shifting the tile, there is no place to shift meaning that the tiles are already in the shifted position at first. In such case the tile shouldn't be eligible for generating new tile2 unless the stack is mergeable.

  // So from the above observations, we can say that, A stack is eligible for generating a new tile2, if:
  // 1. isShiftable 2. isMergeable 3. hasEmptyTiles (These can be the variable names for the code, also stacksEligibleForGenerating should be the name for the array holding the tiles eligible for generating a new tile2)

  // Sorry I was wrong in the above observation. Actually every stack with empty tiles are eligible for generating, so just checking if there is any empty tile in the stack, is enough.
  // The thing that should be corrected is that, if any of the stack got shifed to germinate a new tile2. Like if I do a leftMove, if none of the stacks are shifted or none are merged, in that case I should not generate a new tile2, and the move will just do nothing, so forcing the player to do any other move.


  //MAYBE NOW I SHOULD WRITE AN ALGORITHM as I now understand what should be done
  // 1. 


  const handle = (key) => {
    const getShiftedStack = (stack) => {
      let returnStack = stack.filter(tile => tile>0)
      for(let i = 0; i < 4; i++){
        if(i < returnStack.length){
          continue; //
        }
        else {
          returnStack.push(0)//by pushing the 0s at the end we basically completed the shift
        }
      }
      return returnStack;
    } 
    const getMergedSum = (stack) => {
      let sum = 0;
      // logic to merge two tiles with the same values
      for(let i = 0; i < stack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
        if(stack[i+1] === stack[i]) {
          stack[i] *= 2
          sum += stack[i]
          stack[i+1] = 0;
        }
      }

      // Issue 1. which I mentioned in the documentation is solved simply by shifting the stack after the merge operation, which eliminates the holes in the stack which appear after the merge.
      stack = getShiftedStack(stack);
      return sum;
    }
    const getMergedStack = (stack) => {
      let returnStack = stack;
      // logic to merge two tiles with the same values
      for(let i = 0; i < returnStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
        if(returnStack[i+1] === returnStack[i]) {
          setScore(score + returnStack[i]*2)
          returnStack[i] *= 2
          returnStack[i+1] = 0;
        }
      }
      returnStack = getShiftedStack(returnStack);
      return returnStack;
    }
    switch (key) {
      case 'ArrowLeft':
      {
          let tempGrid = grid.map(stack => stack)
          let gridCopy = tempGrid.map((stack)=> {
              const getShiftedStack = (stack) => {
                let returnStack = stack.filter(tile => tile>0)
                for(let i = 0; i < 4; i++){
                  if(i < returnStack.length){
                    continue; //
                  }
                  else {
                    returnStack.push(0)//by pushing the 0s at the end we basically completed the shift
                  }
                }
                return returnStack;
              } 
              const getMergedStack = (stack) => {
                let returnStack = stack;
                let mergeSum = 0;
                // logic to merge two tiles with the same values
                for(let i = 0; i < returnStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                  if(returnStack[i+1] === returnStack[i]) {
                    returnStack[i] *= 2
                    mergeSum += returnStack[i]
                    returnStack[i+1] = 0;
                  }
                }

                // Issue 1. which I mentioned in the documentation is solved simply by shifting the stack after the merge operation, which eliminates the holes in the stack which appear after the merge.
                returnStack = getShiftedStack(returnStack);
              // console.log('mergeSum',mergeSum);

                return [returnStack,mergeSum];
              }
              let shiftedStack = getShiftedStack(stack);
              let mergedStack = getMergedStack(shiftedStack)[0];
              return mergedStack;
          })
          /*
          // generating new tile 2 logic
          // here check if the new updated grid has been changed or not from the original


          // Now to check if the grid was moved(that means modified by either a shift or merge happening) we can simply compare the original grid to the new gridCopy that went through the algorithm to move the stacks
          // And in the case the grid was moved, we have to generate a new tile2 at a random empty slot which will be generated by the getRandomStackToGenerateNewTile function

          // In order to check if the grid and gridCopy are same or not, we can simply flatten them and compare the resulting arrays.toString(), here we have to use the toString() because in JS if we compare the two arrays using equal operator, it will return always return false due to the array names in JS are actually the references to the arrays in memory
          */


          let wasGridMoved = false;

          if((grid.flat().toString() === gridCopy.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            break;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            // here we should set the previousGrid to the grid's state, so that we can access the value again, when we press the undo button
            setPreviousGrid(grid);
            setPreviousScore(score);

            let mergedSum = tempGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
            let arrayOfEmptySlotIndices = [];
            for(let i = 0; i < 4; i++){
              for(let j = 0; j < 4; j++){
                if(gridCopy[i][j] === 0){
                  arrayOfEmptySlotIndices.push(i.toString() + j.toString()) 
                }
              }
            }

            let randomSlotToGenerateTile2Index = arrayOfEmptySlotIndices[Math.floor(Math.random() * arrayOfEmptySlotIndices.length)]

            for(let i=0; i<4; i++){
              for(let j=0; j<4; j++){
                if(i.toString() + j.toString() === randomSlotToGenerateTile2Index){
                  gridCopy[i][j] = 2;
                  break;
                }
              }
            }
          }
          setGrid(gridCopy);

    }
    break;


    case 'ArrowRight':
      {
        let reversedGrid = reverseGrid(grid);
        let reversedGridCopy = reversedGrid.map((stack)=> {
            let shiftedStack = getShiftedStack(stack);
            let mergedStack = getMergedStack(shiftedStack)
            return mergedStack;
        })
        let wasGridMoved = false;
        let rereversedGrid = reverseGrid(reversedGridCopy)

        if((grid.flat().toString() === rereversedGrid.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
          wasGridMoved = true;
        }
        else{
          wasGridMoved = false;
          break;
        }


        //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
        if(wasGridMoved){
          let mergedSum = reversedGrid.map((stack)=> {
            let shiftedStack = getShiftedStack(stack);
            return getMergedSum(shiftedStack)
          }).reduce((acc,val)=> acc + val)
          setScore(score+mergedSum);
          setPreviousGrid(grid);
          let arrayOfEmptySlotIndices = [];
          for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
              if(rereversedGrid[i][j] === 0){
                arrayOfEmptySlotIndices.push(i.toString() + j.toString()) 
              }
            }
          }

          let randomSlotToGenerateTile2Index = arrayOfEmptySlotIndices[Math.floor(Math.random() * arrayOfEmptySlotIndices.length)]

          for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
              if(i.toString() + j.toString() === randomSlotToGenerateTile2Index){
                rereversedGrid[i][j] = 2;
                break;
              }
            }
          }
        }
        setGrid(rereversedGrid);

  }
  break;

      
    case 'ArrowUp':
      {
        // In this case I use the rotateGripUp function to rotate the grid up and do the shifting, and at the end I rerotate the grid using the same function, check if it is different from the original grid(that is to see if any shifts or moves happened), in which case I generate a new tile2

        // For the ArrowDown Case, maybe just making a similar rotateGridDown Function will do the trick
    
          // let rotatedGrid = rotateGridDownInverse(grid);
          // setGrid(rotatedGrid);


          // break;

          let rotatedGrid = rotateGridUp(grid);
          let rotatedGridCopy = rotatedGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              let mergedStack = getMergedStack(shiftedStack)
              return mergedStack;
          })
         

          /*
          // generating new tile 2 logic
          // here check if the new updated grid has been changed or not from the original


          // Now to check if the grid was moved(that means modified by either a shift or merge happening) we can simply compare the original grid to the new gridCopy that went through the algorithm to move the stacks
          // And in the case the grid was moved, we have to generate a new tile2 at a random empty slot which will be generated by the getRandomStackToGenerateNewTile function

          // In order to check if the grid and gridCopy are same or not, we can simply flatten them and compare the resulting arrays.toString(), here we have to use the toString() because in JS if we compare the two arrays using equal operator, it will return always return false due to the array names in JS are actually the references to the arrays in memory
          */

          let wasGridMoved = false;
          
          
          let rerotatedGrid = rotateGridUp(rotatedGridCopy)

          if((grid.flat().toString() === rerotatedGrid.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            break;

          }

          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            let mergedSum = rotatedGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
            setPreviousGrid(grid);
            let arrayOfEmptySlotIndices = [];
            for(let i = 0; i < 4; i++){
              for(let j = 0; j < 4; j++){
                if(rerotatedGrid[i][j] === 0){
                  arrayOfEmptySlotIndices.push(i.toString() + j.toString()) 
                }
              }
            }

            let randomSlotToGenerateTile2Index = arrayOfEmptySlotIndices[Math.floor(Math.random() * arrayOfEmptySlotIndices.length)]

            for(let i=0; i<4; i++){
              for(let j=0; j<4; j++){
                if(i.toString() + j.toString() === randomSlotToGenerateTile2Index){
                  rerotatedGrid[i][j] = 2;
                  break;
                }
              }
            }
          }

          setGrid(rerotatedGrid);

    }
    break;

    case 'ArrowDown':
      {    
          // setScore(score + 1)
          let rotatedGrid = rotateGridDown(grid);

          let rotatedGridCopy = rotatedGrid.map((stack)=> {
              const getShiftedStack = (stack) => {
                let returnStack = stack.filter(tile => tile>0)
                for(let i = 0; i < 4; i++){
                  if(i < returnStack.length){
                    continue; //
                  }
                  else {
                    returnStack.push(0)//by pushing the 0s at the end we basically completed the shift
                  }
                }
                return returnStack;
              } 
              const getMergedStack = (stack) => {
                let returnStack = stack;
                // logic to merge two tiles with the same values
                for(let i = 0; i < returnStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                  if(returnStack[i+1] === returnStack[i]) {
                    returnStack[i] *= 2
                    returnStack[i+1] = 0;
                  }
                }
                returnStack = getShiftedStack(returnStack);
                return returnStack;
              }

              let shiftedStack = getShiftedStack(stack);
              

              let mergedStack = getMergedStack(shiftedStack)
             
              return mergedStack;
          })
         

          let wasGridMoved = false;
          
          
          let rerotatedGrid = rotateGridDownInverse(rotatedGridCopy)

          if((grid.flat().toString() === rerotatedGrid.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            break;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            let mergedSum = rotatedGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
            setPreviousGrid(grid);
            let arrayOfEmptySlotIndices = [];
            for(let i = 0; i < 4; i++){
              for(let j = 0; j < 4; j++){
                if(rerotatedGrid[i][j] === 0){
                  arrayOfEmptySlotIndices.push(i.toString() + j.toString()) 
                }
              }
            }

            let randomSlotToGenerateTile2Index = arrayOfEmptySlotIndices[Math.floor(Math.random() * arrayOfEmptySlotIndices.length)]

            for(let i=0; i<4; i++){
              for(let j=0; j<4; j++){
                if(i.toString() + j.toString() === randomSlotToGenerateTile2Index){
                  rerotatedGrid[i][j] = 2;
                  break;
                }
              }
            }
          }

          
          console.log(wasGridMoved);
          setGrid(rerotatedGrid);

    }
    break;


    default: break;
    }

    

  }


  return (
    <>
      <div className="container">
        <div className="game-window">
        <div className="header">
          <div className="col col1">
            <div className="logo">
              <span>2048</span>
            </div>
          </div>
          <div className="col col2">
            <div className="scoreboard">
              <span className="scoretext">score</span>
              <span id="score">{score}</span>
            </div>
            <button className="btn btn-new" onClick={handleNew}><div className="btn-label">new</div></button>
          </div>
          <div className="col col3">
            <div className="scoreboard">
              <span className="scoretext">best</span>
              <span id="score">{score}</span>
            </div>
            <button className="btn btn-undo" onClick={handleUndo}><div className="btn-label">undo</div></button>
          </div>
        </div>
        <div className="info">Join the numbers and get to the 2048 tile!</div>
        <div className="board">
          <Stack stack={grid[0]}></Stack>
          <Stack stack={grid[1]}></Stack>
          <Stack stack={grid[2]}></Stack>
          <Stack stack={grid[3]}></Stack>
        </div>

        <div className="footer">
          <div className="movesdisplay">{movesCount} moves</div>
          <div className="timerdisplay">{timer}</div>
        </div>
        </div>
        <div className="sidebar">
          <Updates></Updates>
        </div>
      </div>
    </>
  )
}

export default App




