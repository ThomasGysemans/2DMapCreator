type Tab = "account" | "chart" | "teleportation";
type EditingMod = "default" | "square" | "circle" | "eraser" | "line" | "vertical-line" | "fill" | "pick" | "selecting-pos";
type Grid = number[][];
type ChartItemDesc = { color: string; x: boolean, hidden?: boolean };
type Chart = ChartItemDesc[];

interface Pos {
  x: number;
  y: number;
}

interface Teleportation {
  color: number;
  map: string;
  movX: number;
  movY: number;
  targetY: number;
  targetX: number;
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
  teleportations: Teleportation[];
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