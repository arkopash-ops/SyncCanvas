import type {
    CreateWorkspaceData,
    InviteUserToWorkspaceData,
    InvitationResponse,
    RenameWorkspaceData,
    WorkspaceActionResponse,
    WorkspaceListResponse,
    WorkspaceResponse,
    WorkspaceMembersResponse,
    UserWorkspacesResponse,
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

    getUserWorkspace: async (): Promise<UserWorkspacesResponse> => {
        const res = await api.get<UserWorkspacesResponse>("/workspace/my");
        return res.data;
    },

    searchWorkspace: async (search: string): Promise<WorkspaceListResponse> => {
        const res = await api.get<WorkspaceListResponse>("/workspace/search", {
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

    deleteWorkspace: async (
        workspaceId: string
    ): Promise<WorkspaceActionResponse> => {
        const res = await api.delete<WorkspaceActionResponse>(
            `/workspace/${workspaceId}`
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

    updateMemberRole: async (
        workspaceId: string,
        memberId: string,
        role: "editor" | "viewer"
    ): Promise<WorkspaceResponse> => {
        const res = await api.patch<WorkspaceResponse>(
            `/workspace/${workspaceId}/member/${memberId}/role`,
            { role }
        );
        return res.data;
    },

    getWorkspaceMember: async (
        workspaceId: string
    ): Promise<WorkspaceMembersResponse> => {
        const res = await api.get<WorkspaceMembersResponse>(
            `/workspace/${workspaceId}/members`
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
