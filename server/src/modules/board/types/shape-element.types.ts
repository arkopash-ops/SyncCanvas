import type { IBaseElement } from "./board-elements.types";

export const ShapeTypes = [
    "rectangle",
    "circle",
    "triangle",
] as const;

export type ShapeType = (typeof ShapeTypes)[number];

export interface IShape extends IBaseElement {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: string;
    opacity: string;
}
