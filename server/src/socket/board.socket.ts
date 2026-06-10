import type { Socket } from "socket.io";
import * as Y from "yjs";
import { loadBoardDoc, persistBoard } from "../modules/board/board-yjs-manager";

export const registerBoardSocket = (socket: Socket) => {
    socket.on("join-board", async ({ boardId }) => {
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board ${boardId}`);

        const doc = await loadBoardDoc(boardId);
        const state = Y.encodeStateAsUpdate(doc);

        socket.emit(
            "board-init",
            state
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
        socket.to(boardId).emit(
            "cursor-move",
            cursor
        );
    });
};
