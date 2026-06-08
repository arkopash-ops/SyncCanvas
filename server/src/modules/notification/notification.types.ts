import type { Types } from "mongoose";

export const NotificationTypes = [
    "WORKSPACE_INVITE",
    "WORKSPACE_INVITE_ACCEPTED",
    "WORKSPACE_INVITE_REJECTED",
    "MEMBER_REMOVED",
    "MEMBER_LEFT",
    "ROLE_UPDATED"
] as const;
export type NotificationType = (typeof NotificationTypes)[number];

export interface INotification {
    receiver: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    metadata: Record<string, unknown>;
}
