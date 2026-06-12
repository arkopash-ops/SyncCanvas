import { Layer, Rect, Stage } from "react-konva";
import type { CanvasStageProps } from "../../../types/canvas.types";
import ShapeRenderer from "./ShapeRenderer";
import TransformerManager from "./TransformerManager";

const CanvasStage = ({
  viewport,
  camera,
  activeTool,
  selectedId,
  shapes,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onSelectShape,
}: CanvasStageProps) => {
  return (
    <Stage
      width={viewport.width}
      height={viewport.height}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
    >
      <Layer
        x={camera.x}
        y={camera.y}
        scaleX={camera.scale}
        scaleY={camera.scale}
      >
        <Rect
          x={-20000}
          y={-20000}
          width={40000}
          height={40000}
          fill="#ffffff"
          name="background"
        />

        <ShapeRenderer
          shapes={shapes}
          activeTool={activeTool}
          selectedId={selectedId}
          onSelectShape={onSelectShape}
        />

        <TransformerManager
          selectedId={selectedId}
          activeTool={activeTool}
          shapes={shapes}
        />
      </Layer>
    </Stage>
  );
};

export default CanvasStage;
