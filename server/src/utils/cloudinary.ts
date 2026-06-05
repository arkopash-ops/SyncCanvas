import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadWorkspaceImageToCloudinary = (
    buffer: Buffer
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "Workspace",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const uploadAvatarToCloudinary = (
    buffer: Buffer
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "avatars",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const deleteAvatarFromCloudinary = async (
    publicId: string
) => {
    return cloudinary.uploader.destroy(publicId);
};
