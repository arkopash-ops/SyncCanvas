import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import UserModel from "../modules/user/user.model";

interface JwtPayload {
    id: string;
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        const authHeader = req.header("Authorization");

        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            const err = new Error("No token, authorization denied.") as Error & {
                status?: number;
            };

            err.status = 401;
            return next(err);
        }

        const decoded = verifyToken(token) as JwtPayload;

        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            const err = new Error("Invalid token.") as Error & {
                status?: number;
            };

            err.status = 401;
            return next(err);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
