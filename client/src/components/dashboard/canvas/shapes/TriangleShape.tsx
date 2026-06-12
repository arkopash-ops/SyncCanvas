import { RegularPolygon } from "react-konva";
import type Konva from "konva";

import type { BaseShapeProps } from "../../../../types/shape-renderer.types";
import type { TriangleElement } from "../../../../types/board.types";

const TriangleShape = ({
  shape,
  isSelectable,
  onSelect,
  onDragEnd,
  updateShape,
}: BaseShapeProps<TriangleElement>) => {
  return (
    <RegularPolygon
      id={shape.id}

      x={shape.x}
      y={shape.y}

      sides={3}
      radius={shape.radius}

      rotation={shape.rotation}
      stroke={shape.stroke}
      fill={shape.fill}
      strokeWidth={2}

      draggable={isSelectable}

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}

      onTransformEnd={(e) => {
        const node = e.target as Konva.Circle;

        const scaleX = node.scaleX();

        node.scaleX(1);
        node.scaleY(1);

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),

          radius: (node.width() * scaleX) / 2,
          rotation: node.rotation(),
        });
      }}
    />
  );
};

export default TriangleShape;
