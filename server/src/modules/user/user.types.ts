import type { HydratedDocument } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    bio: string | null;
    avatar: string | null;
    avatarPublicId: string | null;
}

export type UserDocument = HydratedDocument<IUser>;

export type UpdateProfile = {
    name: string;
    email: string;
    bio: string;
};

export type UpdatePassword = {
    currentPassword: string;
    newPassword: string;
};
