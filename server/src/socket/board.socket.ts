import type { Socket } from "socket.io";
import * as Y from "yjs";
import {
    loadBoardDoc,
    persistBoard,
    scheduleSave,
} from "../modules/board/board-yjs-manager";
import {
    getBoardCursor,
    removeCursor,
    updateCursor,
    initializeCursor,
} from "../modules/board/board-presence.service";
import type { IUserCursor } from "../modules/board/types/board-presence.types";

interface JoinBoardPayload {
    boardId: string;
    user: { userId: string; name: string };
}

interface BoardUpdatePayload {
    boardId: string;
    update: number[];
}

interface CursorMovePayload {
    boardId: string;
    cursor: IUserCursor;
}

const USER_COLORS: string[] = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#B19CD9"
];

let colorIndex = 0;

export const registerBoardSocket = (socket: Socket) => {
    socket.on("join-board", async ({ boardId, user }: JoinBoardPayload) => {
        socket.join(boardId);

        socket.data.boardId = boardId;
        socket.data.userId = user.userId;

        console.log(`Socket ${socket.id} joined board ${boardId}`);

        const color = USER_COLORS[colorIndex % USER_COLORS.length]!;
        colorIndex++;

        initializeCursor(boardId, user.userId, user.name, "", color);

        const doc = await loadBoardDoc(boardId);
        const state = Y.encodeStateAsUpdate(doc);

        socket.emit("board-init", Array.from(state));

        const cursors = getBoardCursor(boardId);
        socket.emit("board-cursor", cursors);

        socket.to(boardId).emit("board-cursor", cursors);
    });

    socket.on("board-update", async ({ boardId, update }: BoardUpdatePayload) => {
        const doc = await loadBoardDoc(boardId);

        Y.applyUpdate(doc, new Uint8Array(update));

        await persistBoard(boardId, doc);

        scheduleSave(boardId, doc);

        socket.to(boardId).emit("board-update", update);
    });

    socket.on("cursor-move", ({ boardId, cursor }: CursorMovePayload) => {
        updateCursor(boardId, cursor);
        socket.to(boardId).emit("cursor-move", cursor);
    });

    socket.on("disconnect", () => {
        const boardId = socket.data.boardId as string | undefined;
        const userId = socket.data.userId as string | undefined;

        if (!boardId || !userId) return;

        removeCursor(boardId, userId);
        socket.to(boardId).emit("cursor-remove", userId);
    });

    socket.on("leave-board", ({ boardId }: { boardId: string }) => {
        const userId = socket.data.userId as string | undefined;

        if (!userId) return;

        socket.leave(boardId);
        removeCursor(boardId, userId);
        socket.to(boardId).emit("cursor-remove", userId);
    });
};
