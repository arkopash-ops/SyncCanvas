import { Types } from "mongoose";
import { uploadWorkspaceImageToCloudinary } from "../../utils/cloudinary";
import type { CreateWorkspace, WorkspaceDocument, WorkspaceGrouped } from "./workspace.types";
import type { InviteUserParams } from "../invitation/invitation.types";
import WorkspaceInvitationModel from "../invitation/invitation.model";
import NotificationModel from "../notification/notification.model";
import UserModel from "../user/user.model";
import WorkspaceModel from "./workspace.model";


// create workspace
export const createWorkspace = async ({
    name,
    file,
    owner,
}: CreateWorkspace) => {
    let imageUrl: string | null = null;
    if (file) {
        const uploaded = await uploadWorkspaceImageToCloudinary(file.buffer);
        imageUrl = uploaded.secure_url;
    }

    const workspace = await WorkspaceModel.create({
        name,
        owner: owner,
        image: imageUrl,
        members: [{ userId: owner, role: "owner" }],
    });

    return workspace;
};


// get users all workshop (Owned, Joined)
export const getUserWorkspace = async (userId: string) => {
    const workspaces = await WorkspaceModel.find({
        $or: [
            { owner: userId },
            { "members.userId": userId },
        ],
    })
        .populate("owner", "name email avatar")
        .sort({ updatedAt: -1 })
        .lean<WorkspaceDocument[]>();

    const grouped: WorkspaceGrouped = {
        owned: [],
        joined: [],
    };

    for (const ws of workspaces) {
        const isOwner =
            typeof ws.owner === "object" &&
            ws.owner !== null &&
            "_id" in ws.owner &&
            new Types.ObjectId(ws.owner._id).toString() === userId;

        if (isOwner) {
            grouped.owned.push(ws);
        } else {
            grouped.joined.push(ws);
        }
    }

    return grouped;
};


// search workspace (by workspace name, by owner name)
export const searchWorkspace = async (search: string) => {
    if (!search.trim()) {
        return [];
    }

    const owners = await UserModel.find({
        name: { $regex: search, $options: "i" },
    }).select("_id");

    const ownerIds = owners.map((owner) => owner._id);

    return WorkspaceModel.find({
        $or: [
            { name: { $regex: search, $options: "i" } },
            { owner: { $in: ownerIds } }
        ],
        isActive: true,
    })
        .populate("owner", "name email avatar")
        .sort({ createdAt: -1 });
};


// get workspace by ID
export const getWorkspaceById = async (
    workspaceId: string,
    userId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId)
        .populate("owner", "name email avatar")
        .populate("members.userId", "name email avatar");

    if (!workspace) {
        const err = new Error("Workspace note found");
        (err as any).statusCode = 404;
        throw err;
    }

    const isMember =
        workspace.owner._id.toString() === userId ||
        workspace.members.some((m) => m.userId._id.toString() === userId);

    if (!isMember) {
        const err = new Error("You don't have access to this Workshop.");
        (err as any).statusCode = 400;
        throw err;
    }

    return workspace;
};


// rename workspace (only by owner)
export const renameWorkshop = async (
    workspaceId: string,
    ownerId: string,
    name: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() !== ownerId) {
        const err = new Error("You don't have permission to rename Workspace.");
        (err as any).statusCode = 400;
        throw err;
    }

    workspace.name = name;
    await workspace.save();
    return workspace;
};


// toggle workspace status between Active and Inactive (only by owner)
export const toggleWorkspaceStatus = async (
    workspaceId: string,
    ownerId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() !== ownerId) {
        const err = new Error("You don't have permission to change Workspace Status.");
        (err as any).statusCode = 400;
        throw err;
    }

    workspace.isActive = !workspace.isActive;
    await workspace.save();
    return workspace
};


// delete workspace (only by owner)
export const deleteWorkspace = async (
    workspaceId: string,
    ownerId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() !== ownerId) {
        const err = new Error("You don't have permission to delete Workspace.");
        (err as any).statusCode = 400;
        throw err;
    }

    await WorkspaceModel.findByIdAndDelete(workspaceId);
    await WorkspaceInvitationModel.deleteMany({ workspaceId });
    await NotificationModel.deleteMany({ "metadata.workspaceId": workspaceId });

    return true;
};


// invite user to workspace (only by owner)
export const inviteUserToWorkspace = async ({
    workspaceId,
    inviterId,
    email,
    role
}: InviteUserParams) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const isOwner = workspace.owner.toString() === inviterId;
    if (!isOwner) {
        const err = new Error("You don't have permission to invite user.");
        (err as any).statusCode = 400;
        throw err;
    }

    const invitedUser = await UserModel.findOne({ email });
    if (!invitedUser) {
        const err = new Error("User not Found");
        (err as any).statusCode = 404;
        throw err;
    }

    if (invitedUser._id.toString() === inviterId) {
        const err = new Error("You can't invite your self.");
        (err as any).statusCode = 400;
        throw err;
    }

    const alreadyAMember = workspace.members.some((m) => m.userId.toString() === invitedUser._id.toString());
    if (alreadyAMember) {
        const err = new Error("This User is Already a workspace member.");
        (err as any).statusCode = 400;
        throw err;
    }

    const pendingInvite = await WorkspaceInvitationModel.findOne({
        workspaceId,
        invitedUser: invitedUser._id,
        status: "PENDING",
    });
    if (pendingInvite) {
        const err = new Error("Invitation already sent.");
        (err as any).statusCode = 400;
        throw err;
    }

    const invitation = await WorkspaceInvitationModel.create({
        workspaceId,
        invitedBy: inviterId,
        invitedUser: invitedUser._id,
        role,
    });

    await NotificationModel.create({
        receiver: invitedUser._id,
        sender: inviterId,
        type: "WORKSPACE_INVITE",
        title: "Workspace Invitation",
        message: `You have been invited to join ${workspace.name}`,
        metadata: {
            workspaceId: workspace._id,
            invitation: invitation._id,
        },
    });

    return invitation;
};


// get Workspace members
export const getWorkspaceMember = async (
    workspaceId: string,
    userId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId)
        .populate("owner", "name email avatar")
        .populate("members.userId", "name email avatar");

    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const isMember = workspace.owner._id.toString() === userId ||
        workspace.members.some((m) => m.userId._id.toString() === userId);

    if (!isMember) {
        const err = new Error("You don't have the access to this Workspace.");
        (err as any).statusCode = 404;
        throw err;
    }

    return workspace;
};


// change role of members (only by owner)
export const updateMemberRole = async (
    workspaceId: string,
    ownerId: string,
    memberId: string,
    role: "editor" | "viewer",
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() !== ownerId) {
        const err = new Error("Only Workspace Owner can change the roles.");
        (err as any).statusCode = 400;
        throw err;
    }

    if (workspace.owner.toString() === memberId) {
        const err = new Error("Owner role cannot be changed.");
        (err as any).statusCode = 400;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === memberId);
    if (!member) {
        const err = new Error("Member not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    if (role !== "editor" && role !== "viewer") {
        const err = new Error("Role must be editor or viewer.");
        (err as any).statusCode = 400;
        throw err;
    }

    member.role = role;

    await workspace.save();

    await NotificationModel.create({
        receiver: memberId,
        sender: ownerId,
        type: "ROLE_UPDATED",
        title: "Workspace Role Updated",
        message: `Your role has been changed to ${role} in ${workspace.name}`,
        metadata: {
            workspaceId,
            role,
        },
    });

    return member;
};


// remove user from workspace (only by owner)
export const removeMember = async (
    workspaceId: string,
    ownerId: string,
    memberId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() !== ownerId) {
        const err = new Error("You don't have permission to remove User.");
        (err as any).statusCode = 400;
        throw err;
    }

    if (memberId === workspace.owner.toString()) {
        const err = new Error("Owner can not be remove.");
        (err as any).statusCode = 400;
        throw err;
    }

    const memberExist = workspace.members.some(
        (m) => m.userId.toString() === memberId
    );

    if (!memberExist) {
        const err = new Error("Member not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    workspace.members = workspace.members.filter(
        (m) => m.userId.toString() !== memberId
    );

    await workspace.save();

    await NotificationModel.create({
        receiver: memberId,
        sender: ownerId,
        type: "MEMBER_REMOVED",
        title: "Removed from workspace",
        message: `you were removed from ${workspace.name}`,
        metadata: { workspaceId },
    });

    return true;
};


// leave workspace (only by editor and viewer)
export const leaveWorkspace = async (
    workspaceId: string,
    userId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    if (workspace.owner.toString() === userId) {
        const err = new Error("Workspace owner cannot leave the workspace.");
        (err as any).statusCode = 400;
        throw err;
    }

    const member = workspace.members.find(
        (m) => m.userId.toString() === userId
    );

    if (!member) {
        const err = new Error("You are not the member of this workspace.");
        (err as any).statusCode = 400;
        throw err;
    }

    if (member.role !== "editor" && member.role !== "viewer") {
        const err = new Error("You are not allow to leave this workspace.");
        (err as any).statusCode = 400;
        throw err;
    }

    workspace.members = workspace.members.filter(
        (m) => m.userId.toString() !== userId
    );

    await workspace.save();

    const user = await UserModel.findById(userId)
        .select("name");
    if (!user) {
        const err = new Error("User not found");
        (err as any).statusCode = 404;
        throw err;
    }

    await NotificationModel.create({
        receiver: workspace.owner,
        sender: userId,
        type: "MEMBER_LEFT",
        title: "Member left workspace",
        message: `user ${user.name} left workspace ${workspace.name}`,
        metadata: {
            workspaceId: workspace._id,
            memberId: userId,
        },
    });

    return true;
};
