import type { Tool } from "../components/dashboard/canvas/Toolbar";
import type {
    CircleElement,
    FreehandElement,
    LineElement,
    RectangleElement,
    ShapeElement,
    StickyElement,
    TextElement,
    TriangleElement
} from "../types/board.types";

export const createShape = (
    tool: Tool,
    id: string,
    x: number,
    y: number,
    color: string
): ShapeElement | null => {
    switch (tool) {
        case "rectangle":
            return {
                id,
                type: "rectangle",
                x,
                y,
                width: 0,
                height: 0,
                stroke: color,
                fill: "#ffffff",
                rotation: 0,
            } satisfies RectangleElement;

        case "circle":
            return {
                id,
                type: "circle",
                x,
                y,
                radius: 0,
                stroke: color,
                fill: "#ffffff",
                rotation: 0,
            } satisfies CircleElement;

        case "triangle":
            return {
                id,
                type: "triangle",
                x,
                y,
                radius: 0,
                stroke: color,
                fill: "#ffffff",
                rotation: 0,
            } satisfies TriangleElement;

        case "line":
            return {
                id,
                type: "line",
                x,
                y,
                points: [0, 0, 0, 0],
                stroke: color,
                rotation: 0,
            } satisfies LineElement;

        case "sticky":
            return {
                id,
                type: "sticky",
                x,
                y,
                width: 0,
                height: 0,
                stroke: color,
                fill: "#ffffff",
                textColor: "#000000",
                text: "Sticky note",
                fontSize: 16,
                rotation: 0,
            } satisfies StickyElement;

        case "text":
            return {
                id,
                type: "text",
                x,
                y,
                width: 150,
                fontSize: 20,
                text: "Double click to edit",
                fill: color,
                rotation: 0,
            } satisfies TextElement;

        case "brush":
        case "pencil":
            return {
                id,
                type: "freehand",
                x,
                y,
                points: [0, 0],
                stroke: color,
                rotation: 0,
            } satisfies FreehandElement;

        default:
            return null;
    }
};
