import type { Types } from "mongoose";
import type { ILine } from "./line-element.types";
import type { IText } from "./text-element.types";
import type { IFreehand } from "./freehand-element.types";
import type { IShape } from "./shape-element.types";
import type { IStickyNote } from "./sticky-note-element.types";

export const ElementTypes = [
    "rectangle",
    "circle",
    "triangle",
    "line",
    "text",
    "freehand",
    "sticky-note",
] as const;

export type ElementType = (typeof ElementTypes)[number];

export interface IBaseElement {
    id: string;
    type: ElementType;
    createdBy: Types.ObjectId;
    zIndex: number;
    rotation: number;
    isDeleted: boolean;
    updatedAt: number;
}

export type BoardElement =
    | IShape
    | ILine
    | IText
    | IFreehand
    | IStickyNote;
