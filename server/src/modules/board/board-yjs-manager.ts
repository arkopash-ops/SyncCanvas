import * as Y from "yjs";
import { redisClient } from "../../config/redis";
import BoardModel from "./board.model";

interface CachedBoardDoc {
    doc: Y.Doc;
    lastAccessed: number;
}

const docs = new Map<string, CachedBoardDoc>();

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
            lastAccessed: Date.now(),
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
    doc: Y.Doc,
): Promise<void> => {
    const update = Y.encodeStateAsUpdate(doc);
    const encoded = Buffer.from(update).toString("base64");
    await redisClient.set(`board:${boardId}`, encoded);
};


export const saveSnapshot = async (
    boardId: string,
    doc: Y.Doc,
): Promise<void> => {
    const update = Y.encodeStateAsUpdate(doc);
    await BoardModel.findByIdAndUpdate(boardId, {
        snapshot: {
            yjsState: Buffer.from(update),
            updatedAt: new Date(),
        },
    });
};


// Per-board debounce timers — flush to MongoDB 10 s after the last update
const snapshotTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedule a MongoDB snapshot for the given board. Resets the timer on every
 * call so rapid edits only produce a single DB write after 10 s of inactivity.
 */
export const scheduleSave = (boardId: string, doc: Y.Doc): void => {
    const existing = snapshotTimers.get(boardId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
        snapshotTimers.delete(boardId);
        try {
            await saveSnapshot(boardId, doc);
        } catch (err) {
            console.error(`[board-yjs-manager] snapshot failed for ${boardId}:`, err);
        }
    }, 10_000);

    snapshotTimers.set(boardId, timer);
};
