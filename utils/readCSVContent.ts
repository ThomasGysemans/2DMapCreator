import rgbToHex from "./rgbToHex";

interface CSVContent {
  type: "map" | "chart" | "teleportations";
  result: Grid | Chart | Teleportation[];
}

/**
 * Reads CSV content and returns either a map or a chart.
 * @param fileContent The content of the file
 * @return A grid of numbers that can be later displayed, or a chart of colors.
 */
export default function readCSVContent(fileContent:string): CSVContent {
  const lines = fileContent.trim().split("\n");
  if (lines[0].startsWith("a0")) {
    const grid: Grid = [];
    for (let y = 1; y < lines.length; y++) {
      grid[y-1] = [];
      const numbers = lines[y].split(",");
      for (let x = 2; x < numbers.length; x++) {
        grid[y-1][x-2] = parseInt(numbers[x], 10);
      }
    }
    return {
      type:'map',
      result: grid,
    }
  } else if (lines[0].startsWith("index")) {
    const chart: Chart = [];
    for (let y = 1; y < lines.length; y++) {
      const line = lines[y].split(',');
      const index = parseInt(line[0], 10);
      const x = parseInt(line[1], 10);
      const r = parseInt(line[2], 10);
      const g = parseInt(line[3], 10);
      const b = parseInt(line[4], 10);
      chart[index].color = "#" + rgbToHex([r,g,b]);
      chart[index].x = x == 1;
    }
    return {
      type: 'chart',
      result: chart,
    }
  } else if (lines[0].startsWith("color")) {
    const teleportations: Teleportation[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',');
      teleportations[i-1] = {
        color: parseInt(line[0], 10),
        map: line[1],
        movX: parseInt(line[2], 10),
        movY: parseInt(line[3], 10),
        targetX: parseInt(line[4], 10),
        targetY: parseInt(line[4], 10),
      };
    }
    return {
      type: 'teleportations',
      result: teleportations,
    }
  } else {
    throw new Error("Invalid format for given file.");
  }
}