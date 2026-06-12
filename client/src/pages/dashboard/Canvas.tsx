import { useState } from "react";

import type { ShapeElement } from "../../types/board.types";

import Toolbar, { type Tool } from "../../components/dashboard/canvas/Toolbar";

import CanvasStage from "../../components/dashboard/canvas/CanvasStage";
import PropertiesPanel from "../../components/dashboard/canvas/PropertiesPanel";
import TextEditorOverlay from "../../components/dashboard/canvas/TextEditorOverlay";

import { useCamera } from "../../hooks/canvas/useCamera";
import { useCanvasDrawing } from "../../hooks/canvas/useCanvasDrawing";
import { useShapeAction } from "../../hooks/canvas/useShapeActions";
import { useSelection } from "../../hooks/canvas/useSelection";
import { useTextEditing } from "../../hooks/canvas/useTextEditing";
import { useKeyboardShortcuts } from "../../hooks/canvas/useKeyboardShortcuts";

const Canvas = () => {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  const [activeColor, setActiveColor] = useState("#000000");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [shapes, setShapes] = useState<ShapeElement[]>([]);

  // Camera
  const { camera, viewport, handleWheel, getPointerPosition } = useCamera();

  // Shape actions
  const { updateShape, deleteShape, bringToFront, sendToBack } =
    useShapeAction(setShapes);

  // Text editing
  const {
    editingTextId,
    editingValue,
    setEditingValue,
    startEditing,
    stopEditing,
  } = useTextEditing();

  // Drawing
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing({
    activeTool,
    activeColor,
    setShapes,
    setSelectedId,
    getPointerPosition,
  });

  // Selected shape
  const selectedShape = useSelection(shapes, selectedId);

  // Delete shortcut
  useKeyboardShortcuts({
    selectedId,
    editingTextId,
    onDelete: deleteShape,
  });

  const finishEditingText = () => {
    if (!editingTextId) return;

    updateShape(editingTextId, {
      text: editingValue,
    });

    stopEditing();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      <Toolbar
        activeTool={activeTool}
        activeColor={activeColor}
        onToolChange={setActiveTool}
        onColorChange={setActiveColor}
      />

      {selectedShape && activeTool === "select" && (
        <PropertiesPanel
          shape={selectedShape}
          updateShape={updateShape}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          onDelete={deleteShape}
        />
      )}

      {editingTextId &&
        selectedShape &&
        (selectedShape.type === "text" || selectedShape.type === "sticky") && (
          <TextEditorOverlay
            shape={selectedShape}
            camera={camera}
            value={editingValue}
            onChange={setEditingValue}
            onFinish={finishEditingText}
          />
        )}

      <CanvasStage
        viewport={viewport}
        camera={camera}
        activeTool={activeTool}
        selectedId={selectedId}
        shapes={shapes}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        setSelectedId={setSelectedId}
        updateShape={updateShape}
        startEditing={startEditing}
      />
    </div>
  );
};

export default Canvas;
