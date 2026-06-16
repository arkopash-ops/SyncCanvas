import { Group, Rect, Text } from "react-konva";
import type Konva from "konva";

import type { BaseShapeProps } from "../../../../types/shape-renderer.types";
import type { StickyElement } from "../../../../types/board.types";

interface StickyShapeProps extends BaseShapeProps<StickyElement> {
  onTextEdit: (id: string, text: string) => void;
}

const StickyShape = ({
  shape,
  isSelectable,
  canEdit,
  onSelect,
  onDragEnd,
  updateShape,
  onTextEdit,
}: StickyShapeProps) => {
  return (
    <Group
      id={shape.id}

      x={shape.x}
      y={shape.y}

      width={shape.width}
      height={shape.height}

      rotation={shape.rotation}
      draggable={isSelectable && canEdit}

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDblClick={() => canEdit && onTextEdit(shape.id, shape.text)}

      onDblTap={() => canEdit && onTextEdit(shape.id, shape.text)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}

      onTransformEnd={(e) => {
        if (!canEdit) return;
        const node = e.target as Konva.Group;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    >
      <Rect
        width={shape.width}
        height={shape.height}

        stroke={shape.stroke}
        fill={shape.fill}
        strokeWidth={2}
        cornerRadius={4}

        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.15}
        shadowOffset={{ x: 2, y: 2 }}
      />

      <Text
        x={10}
        y={10}

        width={Math.max(10, shape.width - 20)}
        height={Math.max(10, shape.height - 20)}

        text={shape.text}
        fontSize={shape.fontSize}

        fill={shape.textColor}
        
        align="center"
        verticalAlign="middle"
        wrap="word"
      />
    </Group>
  );
};

export default StickyShape;
