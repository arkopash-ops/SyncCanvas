import type { IBaseElement } from "./board-elements.types";

export interface IText extends IBaseElement {
    type: "text",
    x: number;
    y: number;
    width: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
}
