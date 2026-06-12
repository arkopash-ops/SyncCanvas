import type { ShapeElement } from "../../types/board.types";

export const useSelection = (
    shapes: ShapeElement[],
    selectedId: string | null
) => {
    return shapes.find(
        (shape) => shape.id === selectedId
    );
};
