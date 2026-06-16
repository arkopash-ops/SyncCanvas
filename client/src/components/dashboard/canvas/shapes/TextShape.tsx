import { Text } from "react-konva";
import type Konva from "konva";

import type { BaseShapeProps } from "../../../../types/shape-renderer.types";
import type { TextElement } from "../../../../types/board.types";

interface TextShapeProps extends BaseShapeProps<TextElement> {
  onTextEdit: (id: string, text: string) => void;
}

const TextShape = ({
  shape,
  isSelectable,
  canEdit,
  onSelect,
  onDragEnd,
  updateShape,
  onTextEdit,
}: TextShapeProps) => {
  return (
    <Text
      id={shape.id}

      x={shape.x}
      y={shape.y}

      text={shape.text}
      width={shape.width}
      fontSize={shape.fontSize}
      fill={shape.fill}
      rotation={shape.rotation}
      draggable={isSelectable && canEdit}

      onClick={(e) => onSelect(e, shape.id)}

      onTap={(e) => onSelect(e, shape.id)}

      onDblClick={() => canEdit && onTextEdit(shape.id, shape.text)}

      onDblTap={() => canEdit && onTextEdit(shape.id, shape.text)}

      onDragEnd={(e) => onDragEnd(e, shape.id)}

      onTransformEnd={(e) => {
        if (!canEdit) return;
        const node = e.target as Konva.Text;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        const newWidth = Math.max(20, node.width() * scaleX);

        const newFontSize = Math.max(10, node.fontSize() * scaleY);

        node.scaleX(1);
        node.scaleY(1);

        updateShape(shape.id, {
          x: node.x(),
          y: node.y(),
          width: newWidth,
          fontSize: newFontSize,
          rotation: node.rotation(),
        });
      }}
    />
  );
};

export default TextShape;
