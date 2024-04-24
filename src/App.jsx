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

  const rotateGridUp = (gridToRotate) => {
    let temp1 = gridToRotate.map(stack => stack.map(tile => tile))
    let temp2 = gridToRotate.map(stack => stack.map(tile => tile))

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


  // Now I need to update the handle function to incorporate the key up down and the whole 2D sheninigans


  // While testing I found one issue: Because I implemented checking if the stackWithAtLeastOneEmptyTile to check if there is any empty tile in the stack and based on that I marked the stack as eligible for generating a new tile. But in case a tile has empty tiles but all to the end, i.e. while shifting the tile, there is no place to shift meaning that the tiles are already in the shifted position at first. In such case the tile shouldn't be eligible for generating new tile2 unless the stack is mergeable.

  // So from the above observations, we can say that, A stack is eligible for generating a new tile2, if:
  // 1. isShiftable 2. isMergeable 3. hasEmptyTiles (These can be the variable names for the code, also stacksEligibleForGenerating should be the name for the array holding the tiles eligible for generating a new tile2)

  // Sorry I was wrong in the above observation. Actually every stack with empty tiles are eligible for generating, so just checking if there is any empty tile in the stack, is enough.
  // The thing that should be corrected is that, if any of the stack got shifed to germinate a new tile2. Like if I do a leftMove, if none of the stacks are shifted or none are merged, in that case I should not generate a new tile2, and the move will just do nothing, so forcing the player to do any other move.


  //MAYBE NOW I SHOULD WRITE AN ALGORITHM as I now understand what should be done
  // 1. 


  const handle = (key) => {

    //Rather than using the condition for just left and right, I will use a switch case statement for each key presses
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
                // logic to merge two tiles with the same values
                for(let i = 0; i < returnStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                  if(returnStack[i+1] === returnStack[i]) {
                    returnStack[i] *= 2
                    returnStack[i+1] = 0;
                  }
                }
                return returnStack;
              }

              let shiftedStack = getShiftedStack(stack);
              

              let mergedStack = getMergedStack(shiftedStack)
              /*
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              // shiftedStack = shiftedStack.filter(t => t > 0)
              
              // for(let i = 0; i < 4; i++){
              //   if(i < shiftedStack.length){
              //     continue; //
              //   }
              //   else {
              //     shiftedStack.push(0)
              //   }
              // }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
              //   if(check){
              //     if(index === randomStackToGenerateNewTile){
              //       let emptyCells = [];
              //         for(let i = 0; i <shiftedStack.length; i++){
              //           if(shiftedStack[i] === 0){
              //             emptyCells.push(i)
              //           }
              //         }
              //         //randomly select an empty cell and populate it with 2
              //         let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
              //         shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              //   }
              //   }
              
              // // also need to reverse at the end to get the correct tiles
              // // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // // console.log('asdf: ',shiftedStack);
              // index++;
              */
              // return mergedStack;
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
          console.log(grid.flat().toString());


          if((grid.flat().toString() === gridCopy.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
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

          console.log(gridCopy.flat().toString());
          console.log(wasGridMoved);
          setGrid(gridCopy);

    }
    break;


    case 'ArrowRight':
      {
          let tempGrid = grid.map(stack => stack)
          let gridCopy = tempGrid.map((stack)=> {
              let r_stack = stack.reverse();
              const getShiftedStack = (r_stack) => {
                let returnStack = r_stack.filter(tile => tile>0)
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
              const getMergedStack = (r_stack) => {
                let returnStack = r_stack;
                // logic to merge two tiles with the same values
                for(let i = 0; i < returnStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                  if(returnStack[i+1] === returnStack[i]) {
                    returnStack[i] *= 2
                    returnStack[i+1] = 0;
                  }
                }
                return returnStack;
              }

              let shiftedStack = getShiftedStack(r_stack);
              

              let mergedStack = getMergedStack(shiftedStack)
              return mergedStack.reverse();
          })
         

          /*
          // generating new tile 2 logic
          // here check if the new updated grid has been changed or not from the original


          // Now to check if the grid was moved(that means modified by either a shift or merge happening) we can simply compare the original grid to the new gridCopy that went through the algorithm to move the stacks
          // And in the case the grid was moved, we have to generate a new tile2 at a random empty slot which will be generated by the getRandomStackToGenerateNewTile function

          // In order to check if the grid and gridCopy are same or not, we can simply flatten them and compare the resulting arrays.toString(), here we have to use the toString() because in JS if we compare the two arrays using equal operator, it will return always return false due to the array names in JS are actually the references to the arrays in memory
          */

          let wasGridMoved = false;
          console.log(grid.flat().toString());
          console.log(gridCopy.map(stack => {
            let array = stack.map(x=>x)
            return array.reverse();
          }).flat().toString());


          // Here I had to create the reversedGridCopyFlattened string in order to get the reversed 
          // All these shenanigans just to make sure I don't mutate the gridCopy while checking the reverse in the conditional statement below where I check wasGridMoved or not
          let reversedGridCopyFlattened = gridCopy.map(stack => {
            let array = stack.map(x=>x)
            return array.reverse();
          }).flat().toString();

          if((grid.flat().toString() === reversedGridCopyFlattened) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
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

          console.log(gridCopy.flat().toString());
          console.log(wasGridMoved);
          setGrid(gridCopy);

    }
    break;
      
    case 'ArrowUp':
      {
        // In this case I use the rotateGripUp function to rotate the grid up and do the shifting, and at the end I rerotate the grid using the same function, check if it is different from the original grid(that is to see if any shifts or moves happened), in which case I generate a new tile2

        // For the ArrowDown Case, maybe just making a similar rotateGridDown Function will do the trick
    
          let rotatedGrid = rotateGridUp(grid);
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
                return returnStack;
              }

              let shiftedStack = getShiftedStack(stack);
              

              let mergedStack = getMergedStack(shiftedStack)
              /*
              // after we merged the tiles, we need to shift the tiles again
              // so we first filter the populated tiles again and push 0s at the end to make the shift logic happen again
              // maybe after this I should try to extract the shifting function to make the code more modular
              // shiftedStack = shiftedStack.filter(t => t > 0)
              
              // for(let i = 0; i < 4; i++){
              //   if(i < shiftedStack.length){
              //     continue; //
              //   }
              //   else {
              //     shiftedStack.push(0)
              //   }
              // }

              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
              //   if(check){
              //     if(index === randomStackToGenerateNewTile){
              //       let emptyCells = [];
              //         for(let i = 0; i <shiftedStack.length; i++){
              //           if(shiftedStack[i] === 0){
              //             emptyCells.push(i)
              //           }
              //         }
              //         //randomly select an empty cell and populate it with 2
              //         let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
              //         shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              //   }
              //   }
              
              // // also need to reverse at the end to get the correct tiles
              // // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // // console.log('asdf: ',shiftedStack);
              // index++;
              */
              // return mergedStack;
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
          
          console.log('rotated grid :', rotatedGridCopy.flat().toString());
          console.log('original grid: ',grid.flat().toString());
          console.log('rerotated grid :', rerotatedGrid.flat().toString());

          if((grid.flat().toString() === rerotatedGrid.flat().toString()) === false){//if the original grid and gridCopy are different that means the grid has been moved
            wasGridMoved = true;
          }
          else{
            wasGridMoved = false;
          }


          //Now in case the grid was moved, we need to generate a new tile2 at a random empty slot
          if(wasGridMoved){
            let arrayOfEmptySlotIndices = [];
            for(let i = 0; i < 4; i++){
              for(let j = 0; j < 4; j++){
                if(rotatedGridCopy[i][j] === 0){
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

      case 'up': {

        let rotatedGrid = rotateGridUp();

        // trying to make an array of stacks with at least one empty tile

          // let stacksEligibleForGenerating = [];
          // for(let i = 0; i < rotatedGrid.length; i++){

          //   if(rotatedGrid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
          //     stacksEligibleForGenerating.push(i)
          //   }

          // }
          // let randomStackToGenerateNewTile = stacksEligibleForGenerating[Math.floor(Math.random() * stacksEligibleForGenerating.length)]
          // console.log('stackWithAtLeastOneEmptyTile: ', stacksEligibleForGenerating)
          // console.log('randomStackToGenerate: ', randomStackToGenerateNewTile)


          // logic to shift and merge the stacks of the grid
          rotatedGrid = rotatedGrid.map((stack,index=0)=> {
              let populatedTiles = stack.filter(tile => tile>0)
              
              for(let i = 0; i < 4; i++){
                if(i < populatedTiles.length){
                  continue; //
                }
                else {
                  populatedTiles.push(0)//by pushing the 0s at the end we basically completed the shift
                }
              }
              let isThisStackShifted = false;
              for(let i=0; i<4; i++){
                if(populatedTiles[i] === stack[i]){
                  isThisStackShifted = true;
                }
                else{
                  isThisStackShifted = true;
                }
              }

              
              // logic to merge two tiles with the same values
              let shiftedStack = populatedTiles;
              let isThisStackMerged = true;
              for(let i = 0; i < shiftedStack.length-1; i++) {// we only iterate over the first 3 tiles to prevent the loop getting out of the array bounds
                if(shiftedStack[i+1] === shiftedStack[i]) {
                  isThisStackMerged = true
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
              console.log(isThisStackShifted, isThisStackMerged)
              // put a logic to generate the  new tiles in the selected stacks only
              // if(index in generatingStack){
              //   console.log('asdfdsafa', index);
              // }
                // Generating new 2 numbered tiles logic
                // generateNew2()
                //find empty cells
              //   if(index === randomStackToGenerateNewTile && (isThisStackMerged || isThisStackShifted)){
              //     let emptyCells = [];
              //       for(let i = 0; i <shiftedStack.length; i++){
              //         if(shiftedStack[i] === 0){
              //           emptyCells.push(i)
              //         }
              //       }
              //       //randomly select an empty cell and populate it with 2
              //       let selectedEmptyCell = Math.floor(Math.random() * emptyCells.length);
              //       shiftedStack[emptyCells[selectedEmptyCell]] = 2;
              // }
              
              // also need to reverse at the end to get the correct tiles
              // setTiles(key==='ArrowLeft'?shiftedStack.map((t)=>t):shiftedStack.map(t => t).reverse())
              // console.log('asdf: ',shiftedStack);
              index++;
              return shiftedStack
          })

          let temp3 = rotatedGrid.map(stack => stack.map(tile => tile))
          let temp4 = rotatedGrid.map(stack => stack.map(tile => tile))

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

          let stacksEligibleForGenerating = [];
          for(let i = 0; i < rotatedGrid.length; i++){

            if(rotatedGrid[i].reduce((acc, tile)=> acc * tile) === 0){ //if there is even a single 0 tile in the stack, then the output of the reducer is 0, so that we can know that there is at least one empty tile in the stack
              stacksEligibleForGenerating.push(i)
            }

          }
          let randomStackToGenerateNewTile = stacksEligibleForGenerating[Math.floor(Math.random() * stacksEligibleForGenerating.length)]
          console.log('stackWithAtLeastOneEmptyTile: ', stacksEligibleForGenerating)
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




