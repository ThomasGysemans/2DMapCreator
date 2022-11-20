/**
 * Firestore store the grids as an array of strings.
 * To use this data on the GUI we must convert it to Grid type.
 */
export default function compileGridData(gridData:GridData): Grid {
  const grid: Grid = [];
  for (let i = 0; i < gridData.length; i++) {
    const line = gridData[i].split(',').map(v => parseInt(v,10));
    grid[i] = line;
  }
  return grid;
}