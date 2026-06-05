import mongoose, { Schema } from "mongoose";
import { Invitation, type IWorkspaceInvitation } from "./invitation.types";
import { UserRoles } from "../workspace/workspace.types";

const WorkspaceInvitationSchema = new Schema<IWorkspaceInvitation>({
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },

    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    invitedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    role: {
        type: String,
        enum: UserRoles as readonly string[],
        required: true,
    },

    status: {
        type: String,
        enum: Invitation as readonly string[],
        default: "PENDING",
        required: true,
    }
}, { timestamps: true });

WorkspaceInvitationSchema.index({
    workspaceId: 1,
    invitedUser: 1,
    status: 1,
});

const WorkspaceInvitationModel =
    (mongoose.models.WorkspaceInvitation as mongoose.Model<IWorkspaceInvitation>) ||
    mongoose.model<IWorkspaceInvitation>("WorkspaceInvitation", WorkspaceInvitationSchema);

export default WorkspaceInvitationModel;
