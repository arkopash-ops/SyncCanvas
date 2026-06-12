import { useCallback } from "react";
import type { ShapeElement } from "../../types/board.types";

export const useShapeAction = (
    setShapes: React.Dispatch<React.SetStateAction<ShapeElement[]>>
) => {
    const updateShape = useCallback((
        id: string,
        attrs: Partial<ShapeElement>
    ) => {
        setShapes((prev) =>
            prev.map((shape) =>
                shape.id === id
                    ? ({ ...shape, ...attrs } as ShapeElement)
                    : shape
            )
        );
    }, [setShapes]);

    const deleteShape = useCallback((id: string) => {
        setShapes((prev) =>
            prev.filter(
                (shape) => shape.id !== id
            )
        );
    }, [setShapes]);

    const bringToFront = useCallback((id: string) => {
        setShapes((prev) => {
            const selected =
                prev.find(
                    (s) => s.id === id
                );

            if (!selected)
                return prev;

            return [
                ...prev.filter((s) => s.id !== id),
                selected,
            ];
        });
    }, [setShapes]);

    const sendToBack = useCallback((id: string) => {
        setShapes((prev) => {
            const selected =
                prev.find((s) => s.id === id);

            if (!selected)
                return prev;

            return [
                selected,
                ...prev.filter((s) => s.id !== id),
            ];
        });
    }, [setShapes]);

    return {
        updateShape,
        deleteShape,
        bringToFront,
        sendToBack,
    };
}