import mongoose, { Schema } from "mongoose";
import { UserRoles, type IWorkspace } from "./workspace.types";

const WorkspaceMemberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    role: {
        type: String,
        enum: UserRoles as readonly string[],
        required: true,
    },

    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const WorkspaceSchema = new Schema<IWorkspace>({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        default: "",
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: {
        type: [WorkspaceMemberSchema],
        default: [],
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const WorkspaceModel =
    (mongoose.models.WorkSpace as mongoose.Model<IWorkspace>) ||
    mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

export default WorkspaceModel;
