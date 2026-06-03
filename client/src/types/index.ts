export interface User {
  name: string;
  email: string;
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

export interface UploadAvatarData {
  avatar: File;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatar: string;
}

export interface DeleteAvatarResponse {
  success: boolean;
  message: string;
}
