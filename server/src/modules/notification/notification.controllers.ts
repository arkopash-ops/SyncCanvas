import type { Request, Response, NextFunction } from "express";
import * as notificationService from "./notification.services"


//get all notifications
export const _getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const notifications = await notificationService.getNotifications(req.user.id);

        return res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};


// get unread notifications count
export const _getUnreadNotificationCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const count = await notificationService.getUnreadNotificationCount(req.user.id);

        return res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        next(error);
    }
};


// mark one notifications as read
export const _markOneNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId = req.params.notificationId;
        if (!notificationId || Array.isArray(notificationId)) {
            return res.status(400).json({ message: "Invalid notification Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const notification = await notificationService.markOneNotificationRead(
            notificationId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};


// mark all notifications as read
export const _markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await notificationService.markAllNotificationsRead(req.user.id);

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
};
