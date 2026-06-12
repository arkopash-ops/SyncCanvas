import type { Types } from "mongoose";

export interface IBoard {
    workspaceId: Types.ObjectId;
    ownerId: Types.ObjectId;
    title: string;
    thumbnail: string | null;
    thumbnailPublicId: string | null;
    starredBy: Types.ObjectId[];
    lastEditedBy?: Types.ObjectId;
    isActive: boolean;
    snapshot?: {
        yjsState: Buffer,
        updatedAt: Date,
    };
}

export interface CreateBoardInput {
    workspaceId: string;
    userId: string;
    title: string;
}

export interface GetBoardByIdInput {
    boardId: string;
    userId: string;
}

export interface RenameBoardInput {
    boardId: string;
    userId: string;
    title: string;
}
