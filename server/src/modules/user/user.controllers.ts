import type { Request, Response, NextFunction } from "express";
import * as userServices from "./user.services";



// update Profile
export const _updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;

        const updatedUser = await userServices.updateProfile(userId, req.body);

        return res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};


// update Password
export const _updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;

        await userServices.updatePassword(userId, req.body);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        next(error);
    }
};


// upload Avatar
export const _uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Avatar is required",
            });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await userServices.uploadAvatar(
            req.user.id,
            req.file.buffer
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            avatar: user.avatar,
            avatarPublicId: user.avatarPublicId,
        });
    } catch (error) {
        next(error);
    }
};


// delete Avatar
export const _deleteAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await userServices.deleteAvatar(req.user.id);

        res.status(200).json({
            success: true,
            message: "Avatar deleted",
        });
    } catch (error) {
        next(error);
    }
};
