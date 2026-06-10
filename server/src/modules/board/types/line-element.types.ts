import type { IBaseElement } from "./board-elements.types";

export interface ILine extends IBaseElement {
    type: "line";
    color: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    stroke: string;
    strokeWidth: number;
}
