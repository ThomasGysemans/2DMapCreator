import { Dispatch, SetStateAction, useCallback } from "react";
import { useState } from "react";

type useGridHook = [Grid, Dispatch<SetStateAction<Grid>>, (pos:Pos, color:number|null, registerState?:(grid:Grid)=>Grid)=>void];

const init = (w: number, h: number, c: number | null) => {
  let grid: Grid = [];
  for (let y = 0; y < h; y++) {
    grid[y] = [];
    for (let x = 0; x < w; x++) {
      grid[y][x] = c;
    }
  }
  return grid;
};

const useGrid = (width: number, height: number, initialColor: number|null): useGridHook => {
  const [grid, setGrid] = useState<Grid>(() => init(width, height, initialColor));
  const drawPixel = useCallback((pos: Pos, color: number | null, registerState?: (grid: Grid) => Grid) => {
    console.group("drawPixel cas called");
    console.log("color is " + color);
    console.groupEnd();
    setGrid(v => {
      v[pos.y][pos.x] = color;
      // C/C++/Rust > JavaScript. We want a deep copy, not a shallow copy.
      // The problem is that the modified pixel will be displayed only after a fast refresh
      return registerState?.(v) ?? JSON.parse(JSON.stringify(v));
    });
  }, []);

  return [grid, setGrid, drawPixel];
};

export default useGrid;