import type { Request, Response, NextFunction } from "express";
import * as userServices from "./user.services";


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

        res.status(200).json({
            success: true,
            avatar: user.avatar,
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
