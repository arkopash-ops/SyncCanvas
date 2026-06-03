import type { HydratedDocument } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    avatarPublicId: string | null;
}

export type UserDocument = HydratedDocument<IUser>;
