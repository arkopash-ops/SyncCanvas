import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.services";


const isProd = process.env.NODE_ENV === "production";

const setAuthCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};


// register a new user
export const _register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await authService.register(req.body);

        setAuthCookie(res, token);

        return res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};


// login a user
export const _login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await authService.login(req.body);

        setAuthCookie(res, token);

        return res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};


// logout a user
export const _logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.logout();
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error)
    }
};
