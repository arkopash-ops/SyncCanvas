import { useEffect } from "react";

interface Props {
    selectedId: string | null;
    editingTextId: string | null;

    onDelete: (id: string) => void;
}

export const useKeyboardShortcuts = ({
    selectedId,
    editingTextId,
    onDelete,
}: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
    }, [selectedId, editingTextId, onDelete]);
};
