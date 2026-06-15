import { Layer, Rect, Stage } from "react-konva";
import type { CanvasStageProps } from "../../../types/canvas.types";
import ShapeRenderer from "./ShapeRenderer";
import TransformerManager from "./TransformerManager";
import { getCursor } from "../../../utils/getCursor";

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
  onSelect,
  onDragEnd,
  updateShape,
  onTextEdit,
}: CanvasStageProps) => {
  return (
    <Stage
      style={{ cursor: getCursor(activeTool) }}
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
      {/* Background layer: unaffected by destination-out on drawing layer */}
      <Layer>
        <Rect
          x={-20000}
          y={-20000}
          width={40000}
          height={40000}
          fill="#ffffff"
          name="background"
        />
      </Layer>

      {/* Drawing layer */}
      <Layer
        x={camera.x}
        y={camera.y}
        scaleX={camera.scale}
        scaleY={camera.scale}
      >
        <ShapeRenderer
          shapes={shapes}
          activeTool={activeTool}
          onSelect={onSelect}
          onDragEnd={onDragEnd}
          updateShape={updateShape}
          onTextEdit={onTextEdit}
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
