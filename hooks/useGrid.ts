import { Dispatch, SetStateAction, useCallback } from "react";
import { useState } from "react";
import initGrid from "../utils/initGrid";

type useGridHook = [Grid, Dispatch<SetStateAction<Grid>>, (pos:Pos, color:number, tool:EditingMod)=>void, (width:number, height:number)=>void];

const useGrid = (width: number, height: number, initialColor: number): useGridHook => {
  const [grid, setGrid] = useState<Grid>(() => initGrid(width, height, initialColor));
  const drawPixel = useCallback((pos: Pos, color: number, tool:EditingMod) => {
    setGrid(v => {
      const maxY = v.length - 1;
      const maxX = v[0].length - 1;
      console.log("tool is", tool);
      switch (tool) {
        // with tool "eraser" it will already have color set to -1 so the default case handles it
        case "square":
          v[pos.y][pos.x] = color;
          if (pos.y + 1 <= maxY && pos.x + 1 <= maxX) {
            v[pos.y][pos.x + 1] = color;
            v[pos.y + 1][pos.x] = color;
            v[pos.y + 1][pos.x + 1] = color;
          }
          break;
        case "circle":
          v[pos.y][pos.x] = color;
          if (pos.y - 2 >= 0 && pos.x - 2 >= 0 && pos.y + 2 <= maxY && pos.x + 2 <= maxX) {
            v[pos.y - 1][pos.x - 1] = color;
            v[pos.y - 1][pos.x] = color;
            v[pos.y - 2][pos.x] = color;
            v[pos.y - 1][pos.x + 1] = color;
            v[pos.y][pos.x - 2] = color;
            v[pos.y][pos.x - 1] = color;
            v[pos.y][pos.x + 1] = color;
            v[pos.y][pos.x + 2] = color;
            v[pos.y + 1][pos.x - 1] = color;
            v[pos.y + 1][pos.x] = color;
            v[pos.y + 1][pos.x + 1] = color;
            v[pos.y + 2][pos.x] = color;
          }
          break;
        case "line":
          let px = pos.x;
          while (v[pos.y][px] !== color && px <= maxX) {
            v[pos.y][px] = color;
            px++;
          }
        default:
          v[pos.y][pos.x] = color;
      }
      // C/C++/Rust > JavaScript. We want a deep copy, not a shallow copy.
      // The problem is that the modified pixel will be displayed only after a fast refresh
      return JSON.parse(JSON.stringify(v));
    });
  }, []);
  const setDimensions = useCallback((w:number, h:number) => {
    setGrid((v) => {
      let newGrid: Grid = [];
      for (let y = 0; y < h; y++) {
        newGrid[y] = [];
        for (let x = 0; x < w; x++) {
          let currentElement = -1;
          if (v[y] !== undefined && v[y][x] !== undefined) {
            currentElement = v[y][x];
          }
          newGrid[y][x] = currentElement;
        }
      }
      return newGrid;
    });
  }, []);

  return [grid, setGrid, drawPixel, setDimensions];
};

export default useGrid;