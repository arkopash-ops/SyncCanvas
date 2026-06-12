import type { ShapeRendererProps } from "../../../types/shape-renderer.types";

import CircleShape from "./shapes/CircleShape";
import FreehandShape from "./shapes/FreehandShape";
import LineShape from "./shapes/LineShape";
import RectangleShape from "./shapes/RectangleShape";
import StickyShape from "./shapes/StickyShape";
import TextShape from "./shapes/TextShape";
import TriangleShape from "./shapes/TriangleShape";

const ShapeRenderer = ({
  shapes,
  activeTool,
  onSelect,
  onDragEnd,
  updateShape,
  onTextEdit,
}: ShapeRendererProps) => {
  return (
    <>
      {shapes.map((shape) => {
        switch (shape.type) {
          case "rectangle":
            return (
              <RectangleShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
              />
            );

          case "circle":
            return (
              <CircleShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
              />
            );

          case "triangle":
            return (
              <TriangleShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
              />
            );

          case "line":
            return (
              <LineShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
              />
            );

          case "freehand":
            return (
              <FreehandShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
              />
            );

          case "text":
            return (
              <TextShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
                onTextEdit={onTextEdit}
              />
            );

          case "sticky":
            return (
              <StickyShape
                key={shape.id}
                shape={shape}
                isSelectable={activeTool === "select"}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                updateShape={updateShape}
                onTextEdit={onTextEdit}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default ShapeRenderer;
