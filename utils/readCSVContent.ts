import rgbToHex from "./rgbToHex";

interface CSVContent {
  type: 'map' | 'chart';
  result: Grid | string[];
}

/**
 * Reads CSV content and returns either a map or a chart.
 * @param fileContent The content of the file
 * @return A grid of numbers that can be later displayed, or a chart of colors.
 */
export default function readCSVContent(fileContent:string): CSVContent {
  const lines = fileContent.trim().split("\n");
  if (lines[0].startsWith("d0,d1")) {
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
    const chart: string[] = [];
    for (let y = 1; y < lines.length; y++) {
      const line = lines[y].split(',');
      const index = parseInt(line[0], 10);
      const r = parseInt(line[1], 10);
      const g = parseInt(line[2], 10);
      const b = parseInt(line[3], 10);
      chart[index] = "#" + rgbToHex([r,g,b]);
    }
    return {
      type: 'chart',
      result: chart,
    }
  } else {
    throw new Error("Invalid format for given file.");
  }
}