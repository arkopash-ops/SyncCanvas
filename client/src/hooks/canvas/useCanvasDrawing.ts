import { useState } from "react";
import type { Tool } from "../../components/dashboard/canvas/Toolbar";
import type { CircleElement, LineElement, RectangleElement, ShapeElement, StickyElement, TextElement, TriangleElement } from "../../types/board.types";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { createShape } from "../../utils/shapeFactory";

interface UseCanvasDrawingProps {
    activeTool: Tool;
    activeColor: string;

    setShapes: React.Dispatch<React.SetStateAction<ShapeElement[]>>;

    setSelectedId: (id: string | null) => void;

    getPointerPosition: (stage: Konva.Stage) => {
        x: number;
        y: number;
    } | null;
}

export const useCanvasDrawing = ({
    activeTool,
    activeColor,
    setShapes,
    setSelectedId,
    getPointerPosition,
}: UseCanvasDrawingProps) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingShapeId, setDrawingShapeId] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0, });

    const handleMouseDown = (
        e: KonvaEventObject<MouseEvent | TouchEvent>
    ) => {
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = getPointerPosition(stage);
        if (!pos) return;

        if (activeTool === "select") return;

        const shapeId = crypto.randomUUID();

        if (activeTool === "text") {
            const shape = createShape(
                "text",
                shapeId,
                pos.x,
                pos.y,
                activeColor
            ) as TextElement;

            setShapes((prev) => [...prev, shape]);

            setSelectedId(shapeId);

            return;
        }

        const shape = createShape(
            activeTool,
            shapeId,
            pos.x,
            pos.y,
            activeColor
        );
        if (!shape) return;

        setIsDrawing(true);
        setDrawingShapeId(shapeId);

        setStartPos({ x: pos.x, y: pos.y });

        setShapes((prev) => [...prev, shape]);
    };

    const handleMouseMove = (
        e: KonvaEventObject<MouseEvent | TouchEvent>
    ) => {
        if (!isDrawing || !drawingShapeId) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const pos = getPointerPosition(stage);
        if (!pos) return;

        const dx = pos.x - startPos.x;
        const dy = pos.y - startPos.y;

        setShapes((prev) =>
            prev.map((shape) => {
                if (shape.id !== drawingShapeId) return shape;

                switch (shape.type) {
                    case "rectangle":
                    case "sticky": {
                        const x = Math.min(startPos.x, pos.x);
                        const y = Math.min(startPos.y, pos.y);

                        return {
                            ...shape,
                            x,
                            y,
                            width: Math.abs(dx),
                            height: Math.abs(dy),
                        };
                    }

                    case "circle":
                    case "triangle": {
                        return {
                            ...shape,
                            radius: Math.sqrt((dx * dx) + (dy * dy)),
                        };
                    }

                    case "line": {
                        return {
                            ...shape,
                            points: [0, 0, dx, dy],
                        };
                    }

                    case "freehand": {
                        const relativeX = pos.x - shape.x;
                        const relativeY = pos.y - shape.y;

                        return {
                            ...shape,
                            points: [
                                ...shape.points,
                                relativeX,
                                relativeY,
                            ],
                        };
                    }

                    default: return shape;
                }
            })
        );
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (!drawingShapeId) return;

        setShapes((prev) =>
            prev.map((shape) => {
                if (shape.id !== drawingShapeId) return shape;

                switch (shape.type) {
                    case "rectangle":
                        if (shape.width < 5 || shape.height < 5) {
                            return {
                                ...shape,
                                width: 100,
                                height: 100,
                            } as RectangleElement;
                        }
                        break;

                    case "sticky":
                        if (shape.width < 5 || shape.height < 5) {
                            return {
                                ...shape,
                                width: 150,
                                height: 150,
                            } as StickyElement;
                        }
                        break;

                    case "circle":
                        if (shape.radius < 5) {
                            return {
                                ...shape,
                                radius: 50,
                            } as CircleElement;
                        }
                        break;

                    case "triangle":
                        if (shape.radius < 5) {
                            return {
                                ...shape,
                                radius: 50,
                            } as TriangleElement;
                        }
                        break;

                    case "line": {
                        const dx = shape.points[2];
                        const dy = shape.points[3];

                        if (Math.sqrt((dx * dx) + (dy * dy)) < 5) {
                            return {
                                ...shape,
                                points: [0, 0, 100, 0],
                            } as LineElement;
                        }

                        break;
                    }
                }
                return shape;
            })
        );

        setSelectedId(drawingShapeId);

        setDrawingShapeId(null);
    }



    return {
        isDrawing,
        drawingShapeId,

        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
}
