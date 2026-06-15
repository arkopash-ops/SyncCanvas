import type { IUserCursor } from "./types/board-presence.types";

const boardCursor = new Map<
    string,
    Map<string, IUserCursor>
>();

export const initializeCursor = (
    boardId: string,
    userId: string,
    name: string,
    avatar:string,
    color: string,
) => {
    if (!boardCursor.has(boardId)) {
        boardCursor.set(boardId, new Map());
    }

    boardCursor
        .get(boardId)!
        .set(userId, {
            userId,
            name,
            avatar,
            color,
            x: 0,
            y: 0,
        });
};

export const updateCursor = (
    boardId: string,
    cursor: IUserCursor
) => {
    if (!boardCursor.has(boardId)) {
        boardCursor
            .set(boardId, new Map());
    }

    boardCursor
        .get(boardId)!
        .set(cursor.userId, cursor);
};

export const removeCursor = (
    boardId: string,
    userId: string,
) => {
    boardCursor
        .get(boardId)
        ?.delete(userId);
};

export const getBoardCursor = (
    boardId: string
) => {
    return Array.from(
        boardCursor
            .get(boardId)
            ?.values() ?? []
    );
};
