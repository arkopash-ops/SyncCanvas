import bcrypt from "bcryptjs";
import UserModel from "./user.model";
import { deleteAvatarFromCloudinary, uploadAvatarToCloudinary } from "../../utils/cloudinary";
import type { UpdatePassword, UpdateProfile } from "./user.types";
import cloudinary from "../../config/cloudinary";

// update Profile
export const updateProfile = async (
    userId: string,
    data: UpdateProfile
) => {
    const { name, email, bio } = data;

    const user = await UserModel.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        (err as any).statusCode = 404;
        throw err;
    }

    if (email && email !== user.email) {
        const existing = await UserModel.findOne({ email });
        if (existing) {
            const err = new Error("Email already in use");
            (err as any).statusCode = 400;
            throw err;
        }
        user.email = email;
    }

    if (name) user.name = name;

    if (bio !== undefined) user.bio = bio;

    await user.save();
    return user;
};


// update Password
export const updatePassword = async (
    userId: string,
    data: UpdatePassword
) => {
    const { currentPassword, newPassword } = data;

    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
        const err = new Error("User not found");
        (err as any).statusCode = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const err = new Error("Current password is incorrect");
        (err as any).statusCode = 400;
        throw err;
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    return true;
};


// upload Avatar
export const uploadAvatar = async (
    userId: string,
    fileBuffer: Buffer
) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.avatarPublicId) {
        try {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        } catch (err) {
            console.log("Old avatar delete failed:", err);
        }
    }

    const result: any = await uploadAvatarToCloudinary(fileBuffer);

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
            avatar: result.secure_url,
            avatarPublicId: result.public_id,
        },
        { returnDocument: 'after' }
    );

    return updatedUser;
};


// delete Avatar
export const deleteAvatar = async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.avatarPublicId) {
        throw new Error("Avatar not found");
    }

    await deleteAvatarFromCloudinary(user.avatarPublicId);

    user.avatar = null;
    user.avatarPublicId = null;

    await user.save();

    return user;
};
