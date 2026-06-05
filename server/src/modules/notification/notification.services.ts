import NotificationModel from "./notification.model";


//get all notifications
export const getNotifications = async (userId: string) => {
    return NotificationModel.find({ receiver: userId })
        .populate("sender", "name email avatar")
        .sort({ createdAt: -1 });
};


// get unread notifications count
export const getUnreadNotificationCount = async (userId: string) => {
    return NotificationModel.countDocuments({
        receiver: userId,
        isRead: false,
    });
};


// mark one notifications as read
export const markOneNotificationRead = async (
    notificationId: string,
    userId: string
) => {
    const notification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, receiver: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        const err = new Error("Notification not found");
        (err as any).statusCode = 400;
        throw err;
    }

    return notification;
};


// mark all notifications as read
export const markAllNotificationsRead = async (userId: string) => {
    await NotificationModel.updateMany(
        { receiver: userId, isRead: false },
        { isRead: true }
    );

    return true;
};
