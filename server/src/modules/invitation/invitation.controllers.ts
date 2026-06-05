import type { Request, Response, NextFunction } from "express";
import * as invitationService from "./invitation.services"


// get pending invitation 
export const _getPendingInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const invitations = await invitationService.getPendingInvitation(req.user.id);

        return res.status(200).json({
            success: true,
            count: invitations.length,
            data: invitations,
        });
    } catch (error) {
        next(error);
    }
};


// accept invitation
export const _acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invitationId = req.params.invitationId;
        if (!invitationId || Array.isArray(invitationId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const invitation = await invitationService.acceptInvitation(
            invitationId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            data: invitation,
        });
    } catch (error) {
        next(error);
    }
};


// reject invitation
export const _rejectInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invitationId = req.params.invitationId;
        if (!invitationId || Array.isArray(invitationId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const invitation = await invitationService.rejectInvitation(
            invitationId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Invitation rejected successfully",
            data: invitation,
        });
    } catch (error) {
        next(error);
    }
};
