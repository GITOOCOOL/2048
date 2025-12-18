export const checkGameOver = (grid) => {
  // 1. Check for any empty cell (0)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        return false; // Found an empty spot, game not over
      }
    }
  }

  // 2. Check for adjacent matches (horizontal & vertical)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];

      // Check right neighbor
      if (j < 3) {
        if (current === grid[i][j + 1]) {
          return false; // Can merge right
        }
      }

      // Check bottom neighbor
      if (i < 3) {
        if (current === grid[i + 1][j]) {
          return false; // Can merge down
        }
      }
    }
  }

  // No empty cells and no merges possible -> Game Over
  return true;
};
