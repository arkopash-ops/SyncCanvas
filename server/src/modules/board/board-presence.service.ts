import type { IUserCursor } from "./types/board-presence.types";

const boardCursor = new Map<
    string,
    Map<string, IUserCursor>
>();

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
