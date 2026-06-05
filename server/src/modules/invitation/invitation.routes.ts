import { Router } from "express";
import * as invitationController from "./invitation.controllers";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

//get pending invitation
router.get(
    "/pending",
    protect,
    invitationController._getPendingInvitation,
);

// accept invitation
router.post(
    "/:invitationId/accept",
    protect,
    invitationController._acceptInvitation,
);

// reject invitation
router.post(
    "/:invitationId/reject",
    protect,
    invitationController._rejectInvitation,
);

export default router;
