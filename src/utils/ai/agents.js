// src/utils/ai/agents.js

/* Random Agent */
export const randomAgent = (grid) => {
    const moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    return moves[Math.floor(Math.random() * moves.length)];
};

/* Corner Heuristic Agent */
export const cornerAgent = (grid) => {
    const moves = ['ArrowDown', 'ArrowRight', 'ArrowLeft', 'ArrowUp'];
    // Bias towards Bottom-Right
    return moves[Math.floor(Math.random() * 3)];
};

/* --- Helpers for Advanced Agents --- */
// We need simulation logic here. Since 'handlers.js' is React-coupled (calls setters), 
// we must replicate the pure logic or refactor handlers. 
// For safety/speed, let's implement a minimal 2048 engine here.

const rotateLeft = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let res = Array.from({length: cols}, () => Array(rows).fill(0));
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            res[cols-1-c][r] = matrix[r][c];
        }
    }
    return res;
};

// Simulate a move on a grid. Returns new grid or null if no move possible.
const simulateMove = (grid, direction) => {
    let newGrid = grid.map(row => [...row]);
    let score = 0;
    
    // Normalize to "Left" move by rotating
    let rotations = 0;
    if (direction === 'ArrowUp') rotations = 1; // Left? No. Up requires rotation.
    // Standard: 0=Left, 1=Down, 2=Right, 3=Up (depends on implementation)
    // Let's use simpler logic: 
    // Left: process rows. Right: reverse rows, process, reverse.
    // Up: transpose, process, transpose. Down: transpose, reverse, process...
    
    const compress = (row) => {
        let newRow = row.filter(val => val !== 0);
        let moved = false;
        // Merge
        for(let i=0; i<newRow.length-1; i++){
            if(newRow[i] !== 0 && newRow[i] === newRow[i+1]){
                newRow[i] *= 2;
                score += newRow[i];
                newRow[i+1] = 0;
                moved = true; // Actually need to know if ANY move happened
            }
        }
        newRow = newRow.filter(val => val !== 0);
        while(newRow.length < 4) newRow.push(0);
        return newRow;
    };
    
    const perform = (g, isRowOp, isRev) => {
        let changed = false;
        for(let i=0; i<4; i++){
            let line = isRowOp ? g[i] : [g[0][i], g[1][i], g[2][i], g[3][i]];
            if(isRev) line.reverse();
            
            let original = JSON.stringify(line);
            let newLine = compress(line);
            
            if(isRev) newLine.reverse();
            if(JSON.stringify(newLine) !== original) changed = true;
            
            if(isRowOp) g[i] = newLine;
            else { g[0][i] = newLine[0]; g[1][i] = newLine[1]; g[2][i] = newLine[2]; g[3][i] = newLine[3]; }
        }
        return changed;
    };

    let moved = false;
    if(direction === 'ArrowLeft') moved = perform(newGrid, true, false);
    else if(direction === 'ArrowRight') moved = perform(newGrid, true, true);
    else if(direction === 'ArrowUp') moved = perform(newGrid, false, false);
    else if(direction === 'ArrowDown') moved = perform(newGrid, false, true);

    return moved ? { grid: newGrid, score } : null;
};

const evaluateGrid = (grid) => {
    let emptyCells = 0;
    let maxTile = 0;
    let monotonicity = 0;
    let smoothness = 0;
    
    for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
            if(grid[r][c] === 0) emptyCells++;
            if(grid[r][c] > maxTile) maxTile = grid[r][c];
            
            // Smoothness (diff val between neighbors)
            if(c < 3 && grid[r][c] !== 0) smoothness -= Math.abs(grid[r][c] - grid[r][c+1]);
            if(r < 3 && grid[r][c] !== 0) smoothness -= Math.abs(grid[r][c] - grid[r+1][c]);
            
            // Monotonicity (simplified: punish direction changes)
             if(c < 3 && grid[r][c] >= grid[r][c+1]) monotonicity += grid[r][c]; // Left-Right increasing?
             if(r < 3 && grid[r][c] >= grid[r+1][c]) monotonicity += grid[r][c]; // Up-Down increasing
        }
    }
    
    return (emptyCells * 100) + (maxTile * 10) + smoothness + monotonicity;
};

/* Expectimax Agent (Depth 1 for speed) */
// Checks all 4 moves, evaluates resulting grid.
export const expectimaxAgent = (grid) => {
    const moves = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    let bestMove = null;
    let bestScore = -Infinity;

    moves.forEach(move => {
        const res = simulateMove(grid, move);
        if(res) {
            // Heuristic Score of the resulting state
            const score = evaluateGrid(res.grid) + res.score;
            if(score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    });

    return bestMove || moves[Math.floor(Math.random()*4)]; // Fallback
};

/* Monte Carlo Agent (Random Simulations) */
export const monteCarloAgent = (grid) => {
    const moves = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    let bestMove = null;
    let bestTotalScore = -Infinity;
    const SIMULATIONS = 20; // run 20 random games per move

    moves.forEach(move => {
        const res = simulateMove(grid, move);
        if(!res) {
            return; // invalid move
        }
        
        let totalScore = 0;
        
        for(let i=0; i<SIMULATIONS; i++){
            let currentGrid = res.grid.map(r => [...r]);
            let gameOver = false;
            let depth = 0;
            while(!gameOver && depth < 10) { // Limit depth to 10 moves ahead
                let validMoves = moves.filter(m => simulateMove(currentGrid, m));
                if(validMoves.length === 0) { gameOver = true; break;}
                
                // Pick random
                let nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                let nextRes = simulateMove(currentGrid, nextMove);
                currentGrid = nextRes.grid;
                totalScore += nextRes.score; // Count score gained
                
                // Add random tile (simplified 2 at random spot)
                // Actually if we don't add tiles, the board empties? 
                // Simulating game without adding tiles leads to false conclusions.
                // We MUST add a tile after every move.
                let empties = [];
                for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(currentGrid[r][c]===0) empties.push({r,c});
                if(empties.length > 0) {
                    let spot = empties[Math.floor(Math.random()*empties.length)];
                    currentGrid[spot.r][spot.c] = (Math.random() < 0.9) ? 2 : 4;
                }
                
                depth++;
            }
            totalScore += evaluateGrid(currentGrid); // Add final state heuristic
        }
        
        if(totalScore > bestTotalScore) {
            bestTotalScore = totalScore;
            bestMove = move;
        }
    });
    
    return bestMove || moves[Math.floor(Math.random()*4)];
};

export class AIAgent {
    constructor(name, algorithm) {
        this.name = name;
        this.algorithm = algorithm;
    }

    getNextMove(grid) {
        return this.algorithm(grid);
    }
}

export const AGENTS = [
    { id: 'random', name: 'Random Monkey 🐵', algo: randomAgent },
    { id: 'corner', name: 'Corner Creeper 🐍', algo: cornerAgent },
    { id: 'expectimax', name: 'Tactical Brain 🧠', algo: expectimaxAgent },
    { id: 'montecarlo', name: 'Deep Simulator 🔮', algo: monteCarloAgent },
];
