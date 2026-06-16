import { useEffect, useRef } from "react";
import type Konva from "konva";
import type { ShapeElement } from "../../../types/board.types";
import type { Tool } from "./Toolbar";
import { Transformer } from "react-konva";

interface Props {
  selectedId: string | null;
  activeTool: Tool;
  canEdit: boolean;
  shapes: ShapeElement[];
}

const TransformerManager = ({ selectedId, activeTool, canEdit, shapes }: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (activeTool !== "select") {
      transformerRef.current?.nodes([]);
      return;
    }

    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      if (stage) {
        const node = stage.findOne(`#${selectedId}`);
        if (node) {
          transformerRef.current.nodes([node]);

          transformerRef.current.getLayer()?.batchDraw();

          return;
        }
      }
    }

    transformerRef.current?.nodes([]);
  }, [selectedId, activeTool, shapes]);

  if (activeTool !== "select" || !selectedId || !canEdit) return null;

  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) return oldBox;

        return newBox;
      }}
      keepRatio={
        selectedShape?.type === "circle" || selectedShape?.type === "triangle"
      }
      enabledAnchors={
        ["line", "freehand"].includes(selectedShape?.type ?? "")
          ? ["top-left", "bottom-right"]
          : undefined
      }
    />
  );
};

export default TransformerManager;
