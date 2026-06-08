export interface User {
  _id?: string;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  avatarPublicId?: string | null;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  bio: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export interface UploadAvatarData {
  avatar: File;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatar: string;
  avatarPublicId?: string | null;
}

export interface DeleteAvatarResponse {
  success: boolean;
  message: string;
}

export type WorkspaceRole = "owner" | "editor" | "viewer";

export interface WorkspaceMember {
  userId: string | User;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  image: string | null;
  owner: string | User;
  members: WorkspaceMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceData {
  name: string;
  image?: File | null;
}

export interface RenameWorkspaceData {
  name: string;
}

export interface InviteUserToWorkspaceData {
  email: string;
  role: Exclude<WorkspaceRole, "owner">;
}

export interface WorkspaceResponse {
  success: boolean;
  message?: string;
  data: Workspace;
}

export interface WorkspacesResponse {
  success: boolean;
  message?: string;
  data: Workspace[];
}

export interface WorkspaceActionResponse {
  success: boolean;
  message: string;
}

export type NotificationType =
  | "WORKSPACE_INVITE"
  | "WORKSPACE_INVITE_ACCEPTED"
  | "WORKSPACE_INVITE_REJECTED"
  | "MEMBER_REMOVED"
  | "MEMBER_LEFT";

export interface Notification {
  _id: string;
  receiver: string | User;
  sender?: string | User;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface UnreadNotificationCountResponse {
  success: boolean;
  count: number;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data: Notification;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface WorkspaceInvitation {
  _id: string;
  workspaceId: string | Workspace;
  invitedBy: string | User;
  invitedUser: string | User;
  role: WorkspaceRole;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PendingInvitationsResponse {
  success: boolean;
  count: number;
  data: WorkspaceInvitation[];
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data: WorkspaceInvitation;
}
