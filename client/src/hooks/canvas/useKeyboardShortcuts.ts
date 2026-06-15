import { useEffect } from "react";

interface Props {
    selectedId: string | null;
    editingTextId: string | null;

    onDelete: (id: string) => void;
    onUndo: () => void;
    onRedo: () => void;
}

export const useKeyboardShortcuts = ({
    selectedId,
    editingTextId,
    onDelete,
    onUndo,
    onRedo,
}: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            if (
                activeEl &&
                (activeEl.tagName === "INPUT" ||
                 activeEl.tagName === "TEXTAREA" ||
                 activeEl.hasAttribute("contenteditable"))
            ) {
                return;
            }

            // Undo: Ctrl + Z
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
                e.preventDefault();
                onUndo();
                return;
            }

            // Redo: Ctrl + Y or Ctrl + Shift + Z
            if (
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
            ) {
                e.preventDefault();
                onRedo();
                return;
            }

            if (!selectedId || editingTextId) return;

            if (e.key === "Delete" || e.key === "Backspace") {
                onDelete(selectedId);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => window.removeEventListener(
            "keydown",
            handleKeyDown
        );
    }, [selectedId, editingTextId, onDelete, onUndo, onRedo]);
};
