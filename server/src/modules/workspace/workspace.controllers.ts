import type { Request, Response, NextFunction } from "express";
import * as workspaceService from "./workspace.services";


// create workspace
export const _createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace = await workspaceService.createWorkspace({
            name: req.body.name,
            owner: req.user.id,
            ...(req.file && { file: req.file }),
        });

        return res.status(201).json({
            success: true,
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};


// get users all workshop (Owned, Joined)
export const _getUserWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        const workspaces = await workspaceService.getUserWorkspace(userId);

        return res.status(200).json({
            success: true,
            message: "Workspaces fetched successfully",
            data: workspaces,
        });
    } catch (error) {
        next(error);
    }
};


// get board by workspace
export const _getWorkspaceBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id

        const boards = await workspaceService.getWorkspaceBoard(
            workspaceId,
            userId,
        );

        res.status(200).json({
            success: true,
            count: boards.length,
            boards,
        });
    } catch (error) {
        next(error);
    }
};


// search workspace (by workspace name, by owner name)
export const _searchWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search?.toString() || "";
        const workspaces = await workspaceService.searchWorkspace(search);

        return res.status(200).json({
            success: true,
            data: workspaces,
        });
    } catch (error) {
        next(error);
    }
};


// get workspace by ID
export const _getWorkspaceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace = await workspaceService.getWorkspaceById(
            workspaceId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};


// rename workspace (only by owner)
export const _renameWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace = await workspaceService.renameWorkshop(
            workspaceId,
            req.user.id,
            req.body.name
        );

        return res.status(200).json({
            success: true,
            message:
                "Workspace renamed successfully",
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};


// toggle workspace status between Active and Inactive (only by owner)
export const _toggleWorkspaceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace =
            await workspaceService.toggleWorkspaceStatus(
                workspaceId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message: workspace.isActive
                ? "Workspace activated successfully"
                : "Workspace deactivated successfully",
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};


// delete workspace (only by owner)
export const _deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await workspaceService.deleteWorkspace(workspaceId, req.user.id);

        return res.status(200).json({
            success: true,
            message: "Workspace deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// invite user to workspace (only by owner)
export const _inviteUserToWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        const { email, role } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const inviterId = req.user.id;

        const result = await workspaceService.inviteUserToWorkspace({
            workspaceId,
            inviterId,
            email,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "Invitation sent successfully",
            data: result,
        });
    } catch (error) {
        next(error)
    }
};


// get Workspace members
export const _getWorkspaceMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace = await workspaceService.getWorkspaceMember(
            workspaceId,
            req.user.id,
        );

        const owner = workspace.owner as { _id?: unknown; toString: () => string };
        const ownerId = owner._id ? owner._id.toString() : owner.toString();

        const member = [
            {
                user: workspace.owner,
                role: "owner"
            },

            ...workspace.members.map(
                (m) => ({
                    user: m.userId,
                    role: m.role,
                    joinedAt: m.joinedAt,
                })
            ).filter((m) => {
                const user = m.user as { _id?: unknown };
                return user._id?.toString() !== ownerId;
            }),
        ];

        return res.status(200).json({
            success: true,
            data: member,
        });
    } catch (error) {
        next(error);
    }
};


// change role of members (only by owner)
export const _updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const memberId = req.params.memberId;
        if (!memberId || Array.isArray(memberId)) {
            return res.status(400).json({ message: "Invalid member Id" });
        }

        const { role } = req.body;

        const member = await workspaceService.updateMemberRole(
            workspaceId,
            req.user.id,
            memberId,
            role,
        );

        return res.status(200).json({
            success: true,
            message: "Member role updated successfully.",
            data: member,
        });

    } catch (error) {
        next(error);
    }
};


// remove user from workspace (only by owner)
export const _removeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        const memberId = req.params.memberId;
        if (!memberId || Array.isArray(memberId)) {
            return res.status(400).json({ message: "Invalid member Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await workspaceService.removeMember(
            workspaceId,
            req.user.id,
            memberId
        );

        return res.status(200).json({
            success: true,
            message:
                "Member removed successfully",
        });
    } catch (error) {
        next(error);
    }
};


// leave workspace (only by editor and viewer)
export const _leaveWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await workspaceService.leaveWorkspace(
            workspaceId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message:
                "You left the workspace successfully",
        });
    } catch (error) {
        next(error);
    }
};
