import { useCallback } from "react";
import type { ShapeElement } from "../../types/board.types";

export const useShapeAction = (
    setShapes: React.Dispatch<React.SetStateAction<ShapeElement[]>>,
    saveToHistory: () => void
) => {
    const updateShape = useCallback((
        id: string,
        attrs: Partial<ShapeElement>
    ) => {
        saveToHistory();
        setShapes((prev) =>
            prev.map((shape) =>
                shape.id === id
                    ? ({ ...shape, ...attrs } as ShapeElement)
                    : shape
            )
        );
    }, [setShapes, saveToHistory]);

    const deleteShape = useCallback((id: string) => {
        saveToHistory();
        setShapes((prev) =>
            prev.filter(
                (shape) => shape.id !== id
            )
        );
    }, [setShapes, saveToHistory]);

    const bringToFront = useCallback((id: string) => {
        saveToHistory();
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
    }, [setShapes, saveToHistory]);

    const sendToBack = useCallback((id: string) => {
        saveToHistory();
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
    }, [setShapes, saveToHistory]);

    return {
        updateShape,
        deleteShape,
        bringToFront,
        sendToBack,
    };
}