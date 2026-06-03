import type { IUser } from '../user/user.types';

export type UserRegisterData = {
    name: string;
    email: string;
    password: string;
    avatar?: string;
};

export type UserLoginData = {
    email: string;
    password: string;
};

export type AuthResponse = {
    user:IUser;
    token: string;
}
