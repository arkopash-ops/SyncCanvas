import type {
    MarkAllNotificationsReadResponse,
    NotificationResponse,
    NotificationsResponse,
    UnreadNotificationCountResponse,
} from "../types";
import api from "./api";

export const notificationService = {
    getNotifications: async (): Promise<NotificationsResponse> => {
        const res = await api.get<NotificationsResponse>("/notification");
        return res.data;
    },

    getUnreadNotificationCount: async (): Promise<UnreadNotificationCountResponse> => {
        const res = await api.get<UnreadNotificationCountResponse>(
            "/notification/unread-count"
        );
        return res.data;
    },

    markOneNotificationRead: async (notificationId: string): Promise<NotificationResponse> => {
        const res = await api.patch<NotificationResponse>(
            `/notification/${notificationId}/read`
        );
        return res.data;
    },

    markAllNotificationsRead: async (): Promise<MarkAllNotificationsReadResponse> => {
        const res = await api.patch<MarkAllNotificationsReadResponse>(
            "/notification/read-all"
        );
        return res.data;
    },
};
