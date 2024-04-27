import { useEffect, useState } from 'react';
import './App.css'

import Board from './Board';
import Updates from './Updates';
import Timer from './Timer';
import Header from './Header';

const App = () => {
  const initializeGrid = () => {
      /* Initializing the grid with 2 random tiles with value of 2*/
          let randpos1x = Math.floor(Math.random() * 4);
          let randpos1y = Math.floor(Math.random() * 4);
          let randpos2x = Math.floor(Math.random() * 4);
          let randpos2y = Math.floor(Math.random() * 4);
          let tmp = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
          tmp[randpos1x][randpos1y] = 2
          tmp[randpos2x][randpos2y] = 2
          return tmp;
  }
  const [grid, setGrid] = useState(initializeGrid());
  const [movesCount, setMovesCount] = useState(0);
  // const [grid, setGrid] = useState([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]])
  const [previousGrid, setPreviousGrid] = useState(grid)
  const [score, setScore] = useState(0)
  const [previousScore, setPreviousScore] = useState(score)
  



  const resetGrid = () => {
    let newGrid = initializeGrid()
    setGrid(newGrid)
    setPreviousGrid(newGrid)
    setMovesCount(-2)
    setScore(0)
    setPreviousScore(0)
  }

  useEffect(() => {
    console.log("I am running");
    initializeGrid();
  },[]);

  // useEffect(() =>{
  //   console.log("I am running too");
  //   console.log(movesCount);
  //   setMovesCount(movesCount+1)
  // },[grid]);

  const handleNew = (e)=>{
    e.preventDefault();
    resetGrid();
    // setPreviousGrid(grid);
    setPreviousScore(0);
    setScore(0);
    setMovesCount(0)
  }
  const handleUndo = (e)=>{
    e.preventDefault();
    setGrid(previousGrid);
    setPreviousGrid(grid);
    setScore(previousScore);
  }


  document.onkeydown = (e) => {
    handle(e.code)
  }
const reverseGrid = (gridToReverse) => {
    let temp1 = gridToReverse.map(stack => stack.map(tile => tile))
    let temp2 = gridToReverse.map(stack => stack.map(tile => tile))
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[i][3-j];
      }
    }
    return temp1;
}
  const rotateGridUp = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = gridToRotate.map(stack => stack.map(tile => tile))
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[j][i];
      }
    }
    return temp1;
  }
  const rotateGridDown = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = grid.map(stack => stack.map(tile => tile))
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
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        temp1[i][j] = temp2[j][3-i];
      }
    }
    return temp1;
  }
  const getRandomCellToGenerateNewTile = (movedGrid) => {
    let arrayOfEmptySlotIndices = [];
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        if(movedGrid[i][j] === 0){
          arrayOfEmptySlotIndices.push({i: i, j: j}) 
        }
      }
    }
    let randomCell = arrayOfEmptySlotIndices[Math.floor(Math.random() * arrayOfEmptySlotIndices.length)]
    return randomCell;
  }

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
          let movedGrid = [...grid].map((stack)=> {
              let movedStack = getMergedStack(getShiftedStack(stack));
              return movedStack;
          })

          let wasGridMoved = false;

          if((grid.flat().toString() === movedGrid.flat().toString()) === false){//if the original grid and movedGrid are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            // In case the grid wasn't moved, we just break out of the case, cause there is nothing to change from the original grid.
            break;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            
            let randomCellToGenerateNewTile = getRandomCellToGenerateNewTile(movedGrid);
            let i = randomCellToGenerateNewTile.i;
            let j = randomCellToGenerateNewTile.j;
            movedGrid[i][j] = 2;


            // here we should set the previousGrid to the grid's state, so that we can access the value again, when we press the undo button
            setPreviousGrid(grid);
            setPreviousScore(score);

            let mergedSum = [...grid].map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
          }
          setMovesCount(movesCount+1);
          setGrid(movedGrid);

    }
    break;


    case 'ArrowRight':
      {
        let reversedGrid = reverseGrid(grid);
        let movedGrid = [...reversedGrid].map((stack)=> {
            let movedStack = getMergedStack(getShiftedStack(stack));
            return movedStack;
        })
        let rereversedGrid = reverseGrid(movedGrid)
        
        let wasGridMoved = false;
        if((grid.flat().toString() === rereversedGrid.flat().toString()) === false){//if the original grid and movedGrid are different that means the grid has been moved
          wasGridMoved = true;
        }
        else{
          wasGridMoved = false;
          break;
        }


        //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
        if(wasGridMoved){
          let randomCellToGenerateNewTile = getRandomCellToGenerateNewTile(rereversedGrid);
          let i = randomCellToGenerateNewTile.i;
          let j = randomCellToGenerateNewTile.j;
          rereversedGrid[i][j] = 2;

          let mergedSum = reversedGrid.map((stack)=> {
            let shiftedStack = getShiftedStack(stack);
            return getMergedSum(shiftedStack)
          }).reduce((acc,val)=> acc + val)
          setScore(score+mergedSum);
          setPreviousGrid(grid);
        }
        setMovesCount(movesCount+1);

        setGrid(rereversedGrid);

  }
  break;

      
    case 'ArrowUp':
      {
          let rotatedGrid = rotateGridUp(grid);
          let movedGrid = [...rotatedGrid].map((stack)=> {
              let movedStack = getMergedStack(getShiftedStack(stack));
              return movedStack;
          })

          let wasGridMoved = false;
          
          
          let rerotatedGrid = rotateGridUp(movedGrid);

          if((grid.flat().toString() === rerotatedGrid.flat().toString()) === false){//if the original grid and movedGrid are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            break;

          }

          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            let randomCellToGenerateNewTile = getRandomCellToGenerateNewTile(rerotatedGrid);
            let i = randomCellToGenerateNewTile.i;
            let j = randomCellToGenerateNewTile.j;
            rerotatedGrid[i][j] = 2;

            let mergedSum = rotatedGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
            setPreviousGrid(grid);
          }

          setMovesCount(movesCount+1);

          setGrid(rerotatedGrid);

    }
    break;

    case 'ArrowDown':
      {    
          // setScore(score + 1)
          let rotatedGrid = rotateGridDown(grid);

          let movedGrid = [...rotatedGrid].map((stack)=> {
              let movedStack = getMergedStack(getShiftedStack(stack));
              return movedStack;
          })

          let wasGridMoved = false;
          let rerotatedGrid = rotateGridDownInverse(movedGrid);

          if((grid.flat().toString() === rerotatedGrid.flat().toString()) === false){//if the original grid and movedGrid are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
            break;
          }


          if(wasGridMoved){
            let randomCellToGenerateNewTile = getRandomCellToGenerateNewTile(rerotatedGrid);
            let i = randomCellToGenerateNewTile.i;
            let j = randomCellToGenerateNewTile.j;
            rerotatedGrid[i][j] = 2;

            let mergedSum = rotatedGrid.map((stack)=> {
              let shiftedStack = getShiftedStack(stack);
              return getMergedSum(shiftedStack)
            }).reduce((acc,val)=> acc + val)
            setScore(score+mergedSum);
            setPreviousGrid(grid);
          }
          setMovesCount(movesCount+1);
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
          <Header score={score} handleNew={handleNew} handlUndo={handleUndo}></Header>
          <div className="info">Join the numbers and get to the 2048 tile!</div>
          
          <Board grid={grid}></Board>

          <div className="footer">
            <div className="movesdisplay">{movesCount} moves</div>
            <Timer />
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



// {/* {parseInt(timer/3600)>0?parseInt(timer/3600)+':':''}  */}
// {parseInt(parseInt((parseInt(timer%3600)/60))/10)}{parseInt(parseInt((parseInt(timer%3600)/60))%10)}
// :
// {parseInt(parseInt(parseInt(timer%3600)%60)/10)}{parseInt(parseInt(parseInt(timer%3600)%60)%10)}
