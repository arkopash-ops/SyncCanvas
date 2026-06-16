import { Rect } from "react-konva";
import type Konva from "konva";

import type { BaseShapeProps } from "../../../../types/shape-renderer.types";
import type { RectangleElement } from "../../../../types/board.types";

const RectangleShape = ({
  shape,
  isSelectable,
  canEdit,
  onSelect,
  onDragEnd,
  updateShape,
}: BaseShapeProps<RectangleElement>) => {
  return (
    <Rect
      id={shape.id}

      x={shape.x}
      y={shape.y}

      width={shape.width}
      height={shape.height}

      rotation={shape.rotation}
      stroke={shape.stroke}
      fill={shape.fill}
      strokeWidth={2}

      draggable={isSelectable && canEdit}

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}

      onTransformEnd={(e) => {
        if (!canEdit) return;
        const node = e.target as Konva.Rect;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),

          width: node.width() * scaleX,
          height: node.height() * scaleY,
          rotation: node.rotation(),
        });
      }}
    />
  );
};

export default RectangleShape;
