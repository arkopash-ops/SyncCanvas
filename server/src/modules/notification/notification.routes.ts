import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import * as notificationController from "./notification.controllers";

const router = Router();

//get all notifications
router.get(
    "/",
    protect,
    notificationController._getNotifications,
);

// get unread notifications count
router.get(
    "/unread-count",
    protect,
    notificationController._getUnreadNotificationCount
);

// mark one notifications as read
router.patch(
    "/:notificationId/read",
    protect,
    notificationController._markOneNotificationRead
);

// mark all notifications as read
router.patch(
    "/read-all",
    protect,
    notificationController._markAllNotificationsRead
);

export default router;
