import mongoose, { Schema } from "mongoose";
import { NotificationTypes, type INotification } from "./notification.types";

const NotificationSchema = new Schema<INotification>({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    type: {
        type: String,
        enum: NotificationTypes,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    isRead: {
        type: Boolean,
        default: false,
    },

    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
}, { 
    timestamps: { 
        createdAt: true, 
        updatedAt: false 
    } 
});

NotificationSchema.index({ receiver: 1, isRead: 1 });
NotificationSchema.index({ receiver: 1, createdAt: -1 });

const NotificationModel =
    (mongoose.models.Notification as mongoose.Model<INotification>) ||
    mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
