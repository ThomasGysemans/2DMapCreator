export default function fillGridWith(grid: Grid, x: number, y: number, newColor: number) {
  const previousColor = grid[x][y];
  if (previousColor === newColor) {
    return;
  }
  fill(grid, x, y, previousColor, newColor);
}

function fill(grid:Grid, x:number, y:number, prevC:number, newC:number) {
  const M = grid.length;
  const N = grid[0].length;

  // Base cases
  if (x < 0 || x >= M || y < 0 || y >= N) return;
  if (grid[x][y] != prevC) return;

  // Replace the color at (x, y)
  grid[x][y] = newC;

  // Recur for north, east, south and west
  fill(grid, x + 1, y, prevC, newC);
  fill(grid, x - 1, y, prevC, newC);
  fill(grid, x, y + 1, prevC, newC);
  fill(grid, x, y - 1, prevC, newC);
}