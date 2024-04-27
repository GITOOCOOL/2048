const Updates = () => {
  return (
    <div className="sidebar-panel">
        <h2>Working on now, Issues, Bugs and Features updates ideas</h2>
        <h4>WORKING ON NOW:</h4>   
        <ul>
        <li className="working-on">UI enhancements like, score, buttons like new game, undo, etc.</li>
        <li className="working-on">Score System <p className="comment">So in the original game, score is just the sum of every merge operations. Simple.</p><p className="comment">That wasn't as simple as I thought it would be. To be able to workout the feature I had to refactor all the redundant fuctions outside of each switch case. After that I could figure out how score could be calculated. Now the last issue left is to be able to revert the score back when UNDO is pressed. For which I should use a new state called previousScore and store the previous value of score into it like I did for the grid</p></li>
        <li className="working-on">On pressing undo right after restarting to a new game, we can still get to the previous game because the previousGrid hasn't been resen in the handleUndo function.</li>


        
        </ul>   

        <h4>RECENTLY WORKED ON</h4> 
        <ul>
        <li className="working-on solved">Try to improve the moves counter, it is on a bit shady patch right now. The issue is the counter increases on every button presses, while it should only be increases when the moves changes the board in any way. I think updating the counter only when the grid state changes might do the trick.<p className="comment">Counter is working but, now still on a bit shady patch, because has been initialized at -2 to compensate for the first renders happening without any button presses</p></li>
        <li className="working-on solved">
          The undo button.
          For implementing the UNDO button, and just a single move undo available, I must find a way to store the previous state of grid. Maybe defining a new state with the name previousGrid might do the trick. Let's try!<p className="comment">Just saving the previous state would have worked if there were no rotations and reversal operations on the grid. Also while working on this issue I refactored the codes in the switch cases. Now maybe I can refactor even more as all the cases are too similar right now, maybe I should extract more functions from the code and make it more concise. I will add this to the issues list. </p>
        </li> 
        </ul>       
        <h4>ISSUES:</h4> 
        <ul>
            <li className="working-on">Score System</li>
            <li className="working-on">On pressing undo right after restarting to a new game, we can still get to the previous game because the previousGrid hasn't been resen in the handleUndo function.</li>
            <li className="working-on solved">The undo button</li> 
            <li>Still to be done is the colors of the higher number tiles</li>
            <li className="working-on solved">Try to improve the moves counter, it is on a bit shady patch right now. The issue is the counter increases on every button presses, while it should only be increases when the moves changes the board in any way. I think updating the counter only when the grid state changes might do the trick.</li>
            <li>Now maybe I can refactor even more as all the cases in the switch cases are too similar right now, maybe I should extract more functions from the code and make it more concise.</li>
            <li>Another issue found, after pressing new the move count resets to 1 not 0. Seems like moves count is only becomes 0 at page refresh</li>
            <li>Another issue found, after a page refresh if we press undo, all empty tile comes</li>
            <li>Another issue found, after presseing new more than once, if we press undo, all empty tiles</li>
        </ul>

        <h4>BUGS:</h4>
        <ul>
        <li>At this stage, while playing the game, I found one issue:
            If the tiles are in configuration like: 4 4 2 0, when I press left, the next configuration will be 8 0 2 0, but that is not desired. The next configuration should have been 8 2 0 0.
            I know where that issue is coming from, but I need to figure out something to mitigate this. In case I forget later, the issue stems from the part after I merge two tiles. In the previous code, I had reshifted the tiles again after the merge, which was correct thing to do. But when I was cleaning the code up, I just deleted that reshifting part thinking it was not necessay.</li>
        </ul>     

        <h4>FEATURES UPDATES IDEAS:</h4>
        <ul>
            <li className="working-on">UI enhancements like, score, buttons like new game, undo, etc.</li>
            <li>High Score database</li>
            <li>User profile (maybe I am being too ambitious but if I can I can try to include google auth and other auth apis) </li>
            <li>Share your score screenshot button</li>
            <li>Responsive UI</li>
            <li>undo feature</li>
            <li>Just got an idea of how to implement tetrominoes rotation when I will start builiding Tetris. The same algorithm I used here for rotating the grid can be used to rotate the tetrominoes. And also the tetrominoes can be made out of preFilled grids. Maybe I will branch out this code and start tweaking with the grid to make some tetrominoes simulation.</li>
        </ul>



    </div>
  )
}

export default Updates