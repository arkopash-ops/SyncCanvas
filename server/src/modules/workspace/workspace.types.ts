import type { HydratedDocument, Types } from "mongoose";

export const UserRoles = ["owner", "editor", "viewer"] as const;
export type Role = (typeof UserRoles)[number];

export interface IWorkspaceMember {
    userId: Types.ObjectId;
    role: Role;
    joinedAt: Date;
};

export interface IWorkspace {
    name: string;
    image: string | null;
    owner: Types.ObjectId;
    members: IWorkspaceMember[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type WorkspaceDocument = HydratedDocument<IWorkspace>;

export interface CreateWorkspace {
    name: string;
    file?: Express.Multer.File;
    owner: string;
};

export type WorkspaceGrouped = {
    owned: WorkspaceDocument[];
    invited: WorkspaceDocument[];
};
