export interface BaseElement {
    id: string;
    type: string;
    x: number;
    y: number;
    rotation?: number;
}

export interface RectangleElement extends BaseElement {
    type: "rectangle";
    width: number;
    height: number;
    stroke: string;
    fill: string;
}

export interface CircleElement extends BaseElement {
    type: "circle";
    radius: number;
    stroke: string;
    fill: string;
}

export interface TriangleElement extends BaseElement {
    type: "triangle";
    radius: number; // radius of RegularPolygon
    stroke: string;
    fill: string;
}

export interface LineElement extends BaseElement {
    type: "line";
    points: number[]; // relative points [0, 0, dx, dy]
    stroke: string;
}

export interface FreehandElement extends BaseElement {
    type: "freehand";
    points: number[]; // relative points [x1, y1, x2, y2...]
    stroke: string;
    strokeWidth?: number;
    globalCompositeOperation?: "source-over" | "destination-out";
}

export interface TextElement extends BaseElement {
    type: "text";
    text: string;
    width: number;
    fontSize: number;
    fill: string; // text color
}

export interface StickyElement extends BaseElement {
    type: "sticky";
    text: string;
    width: number;
    height: number;
    stroke: string;
    fill: string; // background fill
    textColor: string; // text color
    fontSize: number;
}

export type ShapeElement =
    | RectangleElement
    | CircleElement
    | TriangleElement
    | LineElement
    | FreehandElement
    | TextElement
    | StickyElement;
