export interface User {
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
