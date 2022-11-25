declare module 'sweetalert2/dist/sweetalert2';

type Tab = "account" | "chart";
type EditingMod = "default" | "square" | "circle" | "eraser";
type Grid = (number)[][];
type Chart = string[];

interface Pos {
  x: number;
  y: number;
}

interface AuthContextValue {
  loading: boolean;
  user: import("firebase/auth").User | null;
}

// We cannot store multidimensional arrays in Firestore
// Therefore, to represent a grid, which is a 2d array,
// each line will be a string, and the grid an array of H strings,
// where H is the height of the grid
type GridData = string[];  // each line is a string

interface UserData {
  projects:ProjectData[];
  registrationDate:number;
  chart: Chart;
}

interface ProjectData {
  name:string;
  lastModifiedDate:number;
  creationDate:number;
  grid:GridData;
}

interface CompiledProjectData extends ProjectData {
  grid:Grid;
}