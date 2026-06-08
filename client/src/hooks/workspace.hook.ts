import { useContext } from "react";
import { WorkspaceContext } from "../context/workspace.context"

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext);

    if (!context) {
        throw new Error("useWorkspaceContext must be used inside WorkspaceProvider");
    }

    return context;
};
