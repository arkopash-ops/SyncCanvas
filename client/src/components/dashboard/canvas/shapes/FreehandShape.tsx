import { Line } from "react-konva";
import type Konva from "konva";

import type { FreehandElement } from "../../../../types/board.types";
import type { BaseShapeProps } from "../../../../types/shape-renderer.types";

const FreehandShape = ({
  shape,
  isSelectable,
  onSelect,
  onDragEnd,
  updateShape,
}: BaseShapeProps<FreehandElement>) => {
  return (
    <Line
      id={shape.id}

      x={shape.x}
      y={shape.y}

      points={shape.points}
      rotation={shape.rotation}
      stroke={shape.stroke}
      strokeWidth={2}
      tension={0.5}
      hitStrokeWidth={20}

      lineCap="round"
      lineJoin="round"

      draggable={isSelectable}

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}
      
      onTransformEnd={(e) => {
        const node = e.target as Konva.Line;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        const transformedPoints = node
          .points()
          .map((value, index) => value * (index % 2 === 0 ? scaleX : scaleY));

        node.scaleX(1);
        node.scaleY(1);

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),
          points: transformedPoints,
          rotation: node.rotation(),
        });
      }}
    />
  );
};

export default FreehandShape;
