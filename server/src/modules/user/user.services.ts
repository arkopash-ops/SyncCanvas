import UserModel from "./user.model";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary";

export const uploadAvatar = async (
    userId: string,
    fileBuffer: Buffer
) => {
    const result: any = await uploadToCloudinary(fileBuffer);

    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            avatar: result.secure_url,
            avatarPublicId: result.public_id,
        },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const deleteAvatar = async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.avatarPublicId) {
        throw new Error("Avatar not found");
    }

    await deleteFromCloudinary(user.avatarPublicId);

    user.avatar = null;
    user.avatarPublicId = null;

    await user.save();

    return user;
};
