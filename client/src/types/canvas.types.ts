import type { KonvaEventObject } from "konva/lib/Node";
import type { Tool } from "../components/dashboard/canvas/Toolbar";
import type { ShapeElement } from "./board.types";

export interface CameraState {
    x: number;
    y: number;
    scale: number;
}

export interface ViewportState {
    width: number;
    height: number;
}

export type CanvasWheelEvent = KonvaEventObject<WheelEvent>;
export type CanvasPointerEvent = KonvaEventObject<MouseEvent | TouchEvent>;

export interface CanvasStageProps {
    viewport: ViewportState;
    camera: CameraState;

    activeTool: Tool;
    selectedId: string | null;

    shapes: ShapeElement[];

    onWheel: (e: CanvasWheelEvent) => void;
    onMouseDown: (e: CanvasPointerEvent) => void;
    onMouseMove: (e: CanvasPointerEvent) => void;
    onMouseUp: () => void;

    onSelect: (e: CanvasPointerEvent, id: string) => void;
    onDragEnd: (e: KonvaEventObject<DragEvent>, id: string) => void;
    updateShape: (id: string, attrs: Partial<ShapeElement>) => void;
    onTextEdit: (id: string, text: string) => void;
}
