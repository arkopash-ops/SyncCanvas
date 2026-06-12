import type { KonvaEventObject } from "konva/lib/Node";
import type { ShapeElement } from "./board.types";
import type { Tool } from "../components/dashboard/canvas/Toolbar";

export interface BaseShapeProps<T extends ShapeElement> {
    shape: T;
    isSelectable: boolean;

    onSelect: (
        e: KonvaEventObject<MouseEvent | TouchEvent>,
        id: string
    ) => void;

    onDragEnd: (
        e: KonvaEventObject<DragEvent>,
        id: string
    ) => void;

    updateShape: (
        id: string,
        attrs: Partial<ShapeElement>
    ) => void;
}


export interface ShapeRendererProps {
    shapes: ShapeElement[];
    activeTool: Tool;

    onSelect: (
        e: KonvaEventObject<MouseEvent | TouchEvent>,
        id: string
    ) => void;

    onDragEnd: (
        e: KonvaEventObject<DragEvent>,
        id: string

    ) => void;

    updateShape: (
        id: string,
        attrs: Partial<ShapeElement>

    ) => void;

    onTextEdit: (
        id: string,
        text: string
    ) => void;
}
