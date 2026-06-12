import { useState } from "react";

export const useTextEditing = () => {
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");

    const startEditing = (id: string, text: string) => {
        setEditingTextId(id);
        setEditingValue(text);
    };

    const stopEditing = () => {
        setEditingTextId(null);
    };

    return {
        editingTextId,
        editingValue,
        setEditingValue,
        startEditing,
        stopEditing,
    };
}
