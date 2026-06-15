import { useEffect, useRef, useCallback } from "react";
import * as Y from "yjs";
import { socket } from "../../lib/socket";
import type { ShapeElement } from "../../types/board.types";

interface UseYjsCanvasOptions {
    boardId: string;
    userId: string;
    userName: string;
    setShapes: React.Dispatch<React.SetStateAction<ShapeElement[]>>;
}

export const useYjsCanvas = ({
    boardId,
    userId,
    userName,
    setShapes,
}: UseYjsCanvasOptions) => {
    const docRef = useRef<Y.Doc>(new Y.Doc());
    const isSyncingRef = useRef(false);

    useEffect(() => {
        const doc = docRef.current;
        const elements = doc.getArray<ShapeElement>("elements");

        socket.emit("join-board", { boardId, user: { userId, name: userName } });

        const onBoardInit = (update: number[]) => {
            Y.applyUpdate(doc, new Uint8Array(update));
            setShapes(elements.toArray());
        };

        const onBoardUpdate = (update: number[]) => {
            isSyncingRef.current = true;
            Y.applyUpdate(doc, new Uint8Array(update));
            setShapes(elements.toArray());
            isSyncingRef.current = false;
        };

        socket.on("board-init", onBoardInit);
        socket.on("board-update", onBoardUpdate);

        return () => {
            socket.off("board-init", onBoardInit);
            socket.off("board-update", onBoardUpdate);
        };
    }, [boardId, userId, userName, setShapes]);

    const syncShapes = useCallback(
        (shapes: ShapeElement[]) => {
            if (isSyncingRef.current) return;

            const doc = docRef.current;
            const elements = doc.getArray<ShapeElement>("elements");

            const update = Y.encodeStateAsUpdate(doc);

            doc.transact(() => {
                elements.delete(0, elements.length);
                elements.insert(0, shapes);
            });

            const newUpdate = Y.encodeStateAsUpdate(doc);
            
            const diff = Y.diffUpdate(newUpdate, update);

            socket.emit("board-update", {
                boardId,
                update: Array.from(diff),
            });
        },
        [boardId],
    );

    return { syncShapes };
};
