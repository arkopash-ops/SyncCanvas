import type { IBaseElement } from "./board-elements.types";

export interface IPoint {
    x: number;
    y: number;
}

export interface IFreehand extends IBaseElement {
    type: "freehand";
    points: IPoint[];
    color: string;
    strokeWidth: number;
    isEraser?: boolean;
}
