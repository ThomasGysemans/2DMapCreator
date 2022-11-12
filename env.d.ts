declare module 'sweetalert2/dist/sweetalert2';

type EditingMod = "default" | "square" | "circle";
type Grid = (number | null)[][];

interface Pos {
  x: number;
  y: number;
}