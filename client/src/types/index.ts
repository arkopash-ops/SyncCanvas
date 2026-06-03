export interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string
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
