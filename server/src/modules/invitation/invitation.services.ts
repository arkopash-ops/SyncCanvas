import { getIO } from '../../socket';
import NotificationModel from '../notification/notification.model';
import UserModel from '../user/user.model';
import WorkspaceModel from '../workspace/workspace.model';
import WorkspaceInvitationModel from './invitation.model';


// get pending invitation
export const getPendingInvitation = async (userId: string) => {
    const invitations = await WorkspaceInvitationModel.find({
        invitedUser: userId,
        status: "PENDING",
    })
        .populate({ path: "workspaceId", select: "name image" })
        .populate({ path: "invitedBy", select: "name email avatar" })
        .sort({ createdAt: -1, });

    return invitations;
};


// accept invitation
export const acceptInvitation = async (
    invitationId: string,
    userId: string
) => {
    const invitation = await WorkspaceInvitationModel.findById(invitationId);
    if (!invitation) {
        const err = new Error("Invitation not found");
        (err as any).statusCode = 400;
        throw err;
    }

    if (invitation.invitedUser.toString() !== userId) {
        const err = new Error("You are not authorized to access this invitation.");
        (err as any).statusCode = 400;
        throw err;
    }

    if (invitation.status !== "PENDING") {
        const err = new Error("Invitation already processed.");
        (err as any).statusCode = 400;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(invitation.workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const alreadyMember = workspace.members.some(
        (m) => m.userId.toString() === userId
    );

    if (!alreadyMember) {
        workspace.members.push({
            userId: invitation.invitedUser,
            role: invitation.role,
            joinedAt: new Date(),
        });

        await workspace.save();
    }

    invitation.status = "ACCEPTED";
    await invitation.save();

    const io = getIO();
    if (io) {
        io.to(`user_${userId}`).emit("workspace_added", {
            workspaceId: workspace._id,
            message: "You have joined new workshop."
        });
    }

    const user = await UserModel.findById(userId)
        .select("name");
    if (!user) {
        const err = new Error("User not found");
        (err as any).statusCode = 404;
        throw err;
    }

    const notification = await NotificationModel.create({
        receiver: invitation.invitedBy,
        sender: invitation.invitedUser,
        type: "WORKSPACE_INVITE_ACCEPTED",
        title: "Invitation Accepted",
        message: `User ${user.name} have accepted the invitation of ${workspace.name} Workspace`,
        metadata: {
            workspaceId: workspace._id,
            invitationId: invitation._id,
        }
    });

    if (io) {
        io.to(`user_${invitation.invitedBy}`).emit("notification_received", {
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
        });
    }

    return invitation;
};


// reject invitation 
export const rejectInvitation = async (
    invitationId: string,
    userId: string
) => {
    const invitation = await WorkspaceInvitationModel.findById(invitationId);
    if (!invitation) {
        const err = new Error("Invitation not found");
        (err as any).statusCode = 400;
        throw err;
    }

    if (invitation.invitedUser.toString() !== userId) {
        const err = new Error("You are not authorized to access this invitation.");
        (err as any).statusCode = 400;
        throw err;
    }

    if (invitation.status !== "PENDING") {
        const err = new Error("Invitation already processed.");
        (err as any).statusCode = 400;
        throw err;
    }

    invitation.status = "REJECTED";
    await invitation.save();

    const user = await UserModel.findById(userId)
        .select("name");
    if (!user) {
        const err = new Error("User not found");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(invitation.workspaceId)
        .select("name");
    if (!workspace) {
        const err = new Error("Workspace not found");
        (err as any).statusCode = 404;
        throw err;
    }

    const notification = await NotificationModel.create({
        receiver: invitation.invitedBy,
        sender: invitation.invitedUser,
        type: "WORKSPACE_INVITE_REJECTED",
        title: "Invitation Rejected",
        message: `User ${user.name} have rejected the invitation of ${workspace.name} Workspace`,
        metadata: {
            workspaceId: workspace._id,
            invitationId: invitation._id,
        },
    });

    const io = getIO();
    if (io) {
        io.to(`user_${invitation.invitedBy}`).emit("notification_received", {
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
        });
    }

    return invitation;
}
