import type { Types } from "mongoose";
import type { Role } from '../workspace/workspace.types';

export const Invitation = ["PENDING", "ACCEPTED", "REJECTED"] as const;
export type InvitationStatus = (typeof Invitation)[number];

export interface IWorkspaceInvitation {
    workspaceId: Types.ObjectId;
    invitedBy: Types.ObjectId;
    invitedUser: Types.ObjectId;
    role: Role;
    status: InvitationStatus;
}

export interface InviteUserParams {
    workspaceId: string;
    inviterId: string;
    email: string;
    role: Role;
}
