import type {
    CreateWorkspaceData,
    InviteUserToWorkspaceData,
    InvitationResponse,
    RenameWorkspaceData,
    WorkspaceActionResponse,
    WorkspaceResponse,
    WorkspacesResponse,
} from "../types";
import api from "./api";

export const workspaceService = {
    createWorkspace: async (
        data: CreateWorkspaceData
    ): Promise<WorkspaceResponse> => {
        const formData = new FormData();
        formData.append("name", data.name);

        if (data.image) {
            formData.append("workspace", data.image);
        }

        const res = await api.post<WorkspaceResponse>("/workspace", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    },

    getUserWorkspace: async (): Promise<WorkspacesResponse> => {
        const res = await api.get<WorkspacesResponse>("/workspace/my");
        return res.data;
    },

    searchWorkspace: async (search: string): Promise<WorkspacesResponse> => {
        const res = await api.get<WorkspacesResponse>("/workspace/search", {
            params: { search },
        });
        return res.data;
    },

    getWorkspaceById: async (workspaceId: string): Promise<WorkspaceResponse> => {
        const res = await api.get<WorkspaceResponse>(`/workspace/${workspaceId}`);
        return res.data;
    },

    renameWorkspace: async (
        workspaceId: string,
        data: RenameWorkspaceData
    ): Promise<WorkspaceResponse> => {
        const res = await api.patch<WorkspaceResponse>(
            `/workspace/${workspaceId}/rename`,
            data
        );
        return res.data;
    },

    toggleWorkspaceStatus: async (
        workspaceId: string
    ): Promise<WorkspaceResponse> => {
        const res = await api.patch<WorkspaceResponse>(
            `/workspace/${workspaceId}/toggle-status`
        );
        return res.data;
    },

    inviteUserToWorkspace: async (
        workspaceId: string,
        data: InviteUserToWorkspaceData
    ): Promise<InvitationResponse> => {
        const res = await api.post<InvitationResponse>(
            `/workspace/${workspaceId}/invite`,
            data
        );
        return res.data;
    },

    removeMember: async (
        workspaceId: string,
        memberId: string
    ): Promise<WorkspaceActionResponse> => {
        const res = await api.delete<WorkspaceActionResponse>(
            `/workspace/${workspaceId}/members/${memberId}/remove`
        );
        return res.data;
    },

    leaveWorkspace: async (
        workspaceId: string
    ): Promise<WorkspaceActionResponse> => {
        const res = await api.post<WorkspaceActionResponse>(
            `/workspace/${workspaceId}/leave`
        );
        return res.data;
    },
};
