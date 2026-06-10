import type { IBoard } from "../board.types";

export interface IStickyNote extends IBoard {
    type: "sticky-note";
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    backgroundColor: string;
}
