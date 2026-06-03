import mongoose from 'mongoose';
import { Schema } from "mongoose";
import type { IUser } from "./user.types";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    avatar: {
        type: String,
        default: null,
    },

    avatarPublicId: {
        type: String,
        default: null,
    },

}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

const UserModel =
    (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);

export default UserModel;
