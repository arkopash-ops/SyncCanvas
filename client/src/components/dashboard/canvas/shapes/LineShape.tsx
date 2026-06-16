import { Line } from "react-konva";
import type Konva from "konva";

import type { LineElement } from "../../../../types/board.types";
import type { BaseShapeProps } from "../../../../types/shape-renderer.types";

const LineShape = ({
  shape,
  isSelectable,
  canEdit,
  onSelect,
  onDragEnd,
  updateShape,
}: BaseShapeProps<LineElement>) => {
  return (
    <Line
      id={shape.id}

      x={shape.x}
      y={shape.y}

      points={shape.points}

      rotation={shape.rotation}
      stroke={shape.stroke}
      strokeWidth={2}
      draggable={isSelectable && canEdit}

      lineCap="round"
      lineJoin="round"

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}

      onTransformEnd={(e) => {
        if (!canEdit) return;
        const node = e.target as Konva.Line;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const pts = node.points();

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),
          points: [
            pts[0] * scaleX,
            pts[1] * scaleY,
            pts[2] * scaleX,
            pts[3] * scaleY,
          ],
          rotation: node.rotation(),
        });
      }}
    />
  );
};

export default LineShape;
