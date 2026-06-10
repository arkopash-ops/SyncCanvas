import * as Y from "yjs";
import { redisClient } from "../../config/redis";
import BoardModel from "./board.model";

interface cachedBoardDoc {
    doc: Y.Doc,
    lastAccessed: number,
}

const docs = new Map<string, cachedBoardDoc>();

export const loadBoardDoc = async (boardId: string): Promise<Y.Doc> => {
    const cached = docs.get(boardId);
    if (cached) {
        cached.lastAccessed = Date.now();
        return cached.doc;
    }

    const doc = new Y.Doc();

    const redisState = await redisClient.get(`board:${boardId}`);
    if (redisState) {
        Y.applyUpdate(doc, Buffer.from(redisState, "base64"));

        docs.set(boardId, {
            doc,
            lastAccessed: Date.now()
        });

        return doc;
    }

    const board = await BoardModel.findById(boardId);
    if (board?.snapshot?.yjsState) {
        Y.applyUpdate(doc, board.snapshot.yjsState);
    }

    docs.set(boardId, {
        doc,
        lastAccessed: Date.now(),
    });

    return doc;
};


export const persistBoard = async (
    boardId: string,
    doc: Y.Doc
) => {
    const update = Y.encodeStateAsUpdate(doc);

    const encoded = Buffer.from(update).toString("base64");

    await redisClient.set(
        `board:${boardId}`,
        encoded
    );
};


export const saveSnapshot = async (
    boardId: string,
    doc: Y.Doc
) => {
    const update = Y.encodeStateAsUpdate(doc);

    await BoardModel.findByIdAndUpdate(boardId, {
        snapshot: {
            yjsState: Buffer.from(update),
            updatedAt: new Date(),
        },
    });
};
