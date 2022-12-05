import { memo } from "react";

interface GridViewProps {
  uid: string;
  grid: Grid;
  chart: Chart;
}

interface PixelProps {
  color:string|null;
  x:number;
  y:number;
}

// color is null for transparent colors,
// i.e when the element in the grid is -1
const Pixel: React.FC<PixelProps> = ({color,x,y}) => {
  return <div
    className="pxm-pixel"
    style={{ backgroundColor: color ? (!color.startsWith('#') ? '#' : '') + color : undefined }}
    data-posx={x}
    data-posy={y}
  />
}

const GridViewComponent: React.FC<GridViewProps> = ({uid,grid,chart}) => {
  return <div className="pxm pxm-readonly-grid" id={uid}>
    {grid.map((line, y) =>
      <div key={y} className="pxm-line">
        {line.map((cell, x) =>
          <Pixel
            key={"pixel-" + y + "-" + x}
            color={cell == -1 ? null : chart[cell].color}
            x={x}
            y={y}
          />
        )}
      </div>
    )}
  </div>
};

const GridView = memo(GridViewComponent);
export default GridView;