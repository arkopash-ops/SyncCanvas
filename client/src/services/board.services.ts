import type {
    BoardListResponse,
    BoardResponse,
    CreateBoardData,
    RenameBoardData,
    UpdateThumbnailData,
    UpdateThumbnailResponse,
    WorkspaceActionResponse,
} from "../types";
import api from "./api";

export const boardService = {
    createBoard: async (data: CreateBoardData): Promise<BoardResponse> => {
        const res = await api.post<BoardResponse>("/board", data);
        return res.data;
    },

    starredBoard: async (): Promise<BoardListResponse> => {
        const res = await api.get<BoardListResponse>("/board/starred");
        return res.data;
    },

    getBoardById: async (boardId: string): Promise<BoardResponse> => {
        const res = await api.get<BoardResponse>(`/board/${boardId}`);
        return res.data;
    },

    renameBoard: async (
        boardId: string,
        data: RenameBoardData
    ): Promise<BoardResponse> => {
        const res = await api.patch<BoardResponse>(
            `/board/${boardId}/rename`,
            data
        );
        return res.data;
    },

    updateThumbnail: async (
        boardId: string,
        data: UpdateThumbnailData
    ): Promise<UpdateThumbnailResponse> => {
        const formData = new FormData();
        formData.append("thumbnail", data.thumbnail);

        const res = await api.patch<UpdateThumbnailResponse>(
            `/board/${boardId}/thumbnail`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        return res.data;
    },

    deleteBoard: async (boardId: string): Promise<WorkspaceActionResponse> => {
        const res = await api.delete<WorkspaceActionResponse>(`/board/${boardId}`);
        return res.data;
    },

    toggleStar: async (boardId: string): Promise<BoardResponse> => {
        const res = await api.patch<BoardResponse>(`/board/${boardId}/star`);
        return res.data;
    },

    duplicateBoard: async (boardId: string): Promise<BoardListResponse> => {
        const res = await api.post<BoardListResponse>(`/board/${boardId}/duplicate`);
        return res.data;
    },

    lastModifiedBoard: async (workspaceId: string, limit = 3): Promise<BoardListResponse> => {
        const res = await api.get<BoardListResponse>(`/board/last-modified/${workspaceId}`, {
            params: { limit },
        });
        return res.data;
    },
};
