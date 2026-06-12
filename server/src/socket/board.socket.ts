import type { Socket } from "socket.io";
import * as Y from "yjs";
import { loadBoardDoc, persistBoard } from "../modules/board/board-yjs-manager";
import { getBoardCursor, removeCursor, updateCursor } from "../modules/board/board-presence.service";

export const registerBoardSocket = (socket: Socket) => {
    socket.on("join-board", async ({ boardId, user }) => {
        socket.join(boardId);

        socket.data.boardId = boardId;
        socket.data.userId = user.userId;

        console.log(`Socket ${socket.id} joined board ${boardId}`);

        const doc = await loadBoardDoc(boardId);
        const state = Y.encodeStateAsUpdate(doc);

        socket.emit(
            "board-init",
            state
        );

        socket.emit(
            "board-cursor",
            getBoardCursor(boardId)
        );
    });

    socket.on("board-update", async ({ boardId, update }) => {
        const doc = await loadBoardDoc(boardId);

        Y.applyUpdate(doc, new Uint8Array(update));

        await persistBoard(boardId, doc);

        socket.to(boardId).emit(
            "board-update",
            update
        );
    });

    socket.on("cursor-move", ({ boardId, cursor }) => {
        updateCursor(boardId, cursor);

        socket.to(boardId).emit(
            "cursor-move",
            cursor
        );
    });

    socket.on("disconnect", () => {
        const boardId = socket.data.boardId;
        const userId = socket.data.userId;

        if (!boardId || !userId) return;

        removeCursor(boardId, userId);

        socket.to(boardId).emit(
            "cursor-remove",
            userId
        );
    });
};
