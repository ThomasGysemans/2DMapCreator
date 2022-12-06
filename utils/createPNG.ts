export default function createPNG(grid:Grid, chart:Chart): string {
  const canvas = document.createElement("canvas");
  canvas.height = grid.length;
  canvas.width = grid[0].length;
  const context = canvas.getContext("2d");
  if (context) {
    const pixSize = 1;
    for (let i = 0; i < grid.length; i++) {
      const line = grid[i];
      for (let j = 0; j < line.length; j++) {
        const colorIndex = line[j];
        if (colorIndex === -1) {
          continue;
        }
        context.fillStyle = chart[colorIndex].color;
        context.fillRect(j * pixSize, i * pixSize, pixSize, pixSize);
      }
    }
  }
  return canvas.toDataURL("image/png", 1.0);
}