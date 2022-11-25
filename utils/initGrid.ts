/**
 * Creates a grid with a default color index from the chart
 * @param w The width of the grid
 * @param h The height of the grid
 * @param c The default color index from the chart
 * @returns An grid of type Grid
 */
export default function initGrid(w: number, h: number, c: number) {
  let grid: Grid = [];
  for (let y = 0; y < h; y++) {
    grid[y] = [];
    for (let x = 0; x < w; x++) {
      grid[y][x] = c;
    }
  }
  return grid;
};