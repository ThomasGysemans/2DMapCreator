/**
 * Given a Grid ((number|null)[][]) we need to create a format Firestore understand.
 * As Firestore doesn't handle multidimensional arrays, we need to come up with something else.
 * Each line of the grid will be a string (with null == 0).
 * Therefore, returning an array of strings of H length, with H the height of the grid.
 * @param grid The grid to be saved later
 * @return The grid Firestore can save
 */
function saveGrid(grid: Grid): GridData {
  const data: string[] = [];
  for (let i = 0; i < grid.length; i++) {
    data.push(grid[i].map(v => v === null ? 0 : v).join(','));
  }
  return data;
}

/**
 * Given project's data, we need to format it an a way that Firestore handles.
 */
export default function saveProject(name:string, chart:Chart, grid:Grid, creationDate:number):ProjectData {
  return {
    name,
    chart,
    grid: saveGrid(grid),
    creationDate,
    lastModifiedDate: new Date().getTime()
  }
}