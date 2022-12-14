import { useEffect } from "react";

interface GridProps {
  grid:Grid;
  chart:Chart;
  uid:string;
  onPixelClicked: (pos:Pos, e:MouseEvent) => void;
  pxSize?:number;
}

interface PixelData {
  x: number;
  y: number;
  uid: string;
}

interface PixelProps {
  onPixelClicked: (pos: Pos, e:MouseEvent) => void;
  x: number;
  y: number;
  color: string | null; // hexadecimal format
  chartIndex:number;
  pxSize?:number;
  hidden?:boolean;
}

const Pixel: React.FC<PixelProps> = ({ color, x, y, pxSize, chartIndex, hidden, onPixelClicked }) => {
  const wh = pxSize !== undefined ? { width: pxSize + "px", height: pxSize + "px" } : {};
  return <div
    className="pxm-pixel"
    onClick={(e) => onPixelClicked({ x, y }, e as any)}
    style={{ backgroundColor: hidden ? undefined : (color ? (!color.startsWith('#') ? '#' : '') + color : undefined), ...wh }}
    data-posx={x}
    data-posy={y}
    data-chartindex={chartIndex}
  />
};

export const Grid: React.FC<GridProps> = ({grid, chart, uid, pxSize, onPixelClicked}) => {
  useEffect(() => {
    let mouseHold = false;
    let heldTimeout: NodeJS.Timeout;
    let drawnPixelsOnHold: PixelData[] = [];

    const onMouseDown = () => {
      heldTimeout = setTimeout(() => {
        mouseHold = true;
      }, 200);
    };

    const onMouseUp = () => {
      clearTimeout(heldTimeout);
      if (mouseHold) {
        mouseHold = false;
        drawnPixelsOnHold = [];
      }
    };

    // Huge performance issue here
    // As it can rebuild the whole grid 91000 times after 30 seconds of moving
    const onMouseMove = (e: MouseEvent) => {
      if (mouseHold) {
        const target = e.target as HTMLElement;
        if (target) {
          if (target.classList.contains("pxm-pixel")) {
            const pos = { x: parseInt(target.dataset.posx!), y: parseInt(target.dataset.posy!) };
            const line = target.parentElement;
            const grid = line?.parentElement;
            if (grid && grid.classList.contains("pxm") && grid.hasAttribute("id")) {
              const uid = grid.getAttribute("id")!;
              const pixelData = { uid, ...pos };
              let alreadyDrawn = false;
              for (let drawnPixel of drawnPixelsOnHold) {
                if (
                  drawnPixel.uid === uid &&
                  drawnPixel.x === pos.x &&
                  drawnPixel.y === pos.y
                ) {
                  alreadyDrawn = true;
                  break;
                }
              }
              if (!alreadyDrawn) {
                onPixelClicked(pos, e);
                drawnPixelsOnHold.push(pixelData);
              }
            }
          }
        }
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onPixelClicked]);

  return <div className="pxm" id={uid}>
    {grid.map((line, y) => 
      <div key={y} className="pxm-line">
        {line.map((cell, x) =>
          <Pixel
            onPixelClicked={onPixelClicked}
            key={"pixel-" + y + "-" + x}
            color={cell == -1 ? null : (chart[cell]?.color ?? null)}
            chartIndex={cell}
            hidden={cell == -1 ? false : (chart[cell]?.hidden ?? false)}
            x={x}
            y={y}
            pxSize={pxSize}
          />
        )}
      </div>
    )}
  </div>
};
