import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import * as workspaceController from "./workspace.controllers";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// create workspace
router.post(
    "/",
    protect,
    upload.single("workspace"),
    workspaceController._createWorkspace,
);

// get users all workshop (Owned, Joined)
router.get(
    "/my",
    protect,
    workspaceController._getUserWorkspace,
);

// search workspace (by workspace name, by owner name)
router.get(
    "/search",
    protect,
    workspaceController._searchWorkspace,
);

// get workspace by ID
router.get(
    "/:workspaceId",
    protect,
    workspaceController._getWorkspaceById,
);

// rename workspace (only by owner)
router.patch(
    "/:workspaceId/rename",
    protect,
    workspaceController._renameWorkspace,
);

// toggle workspace status between Active and Inactive (only by owner)
router.patch(
    "/:workspaceId/toggle-status",
    protect,
    workspaceController._toggleWorkspaceStatus,
);

// delete workspace (only by owner)
router.delete(
    "/:workspaceId",
    protect,
    workspaceController._deleteWorkspace,
);

// invite user to workspace (only by owner)
router.post(
    "/:workspaceId/invite",
    protect,
    workspaceController._inviteUserToWorkspace,
);

// get Workspace members
router.get(
    "/:workspaceId/members",
    protect,
    workspaceController._getWorkspaceMember,
);

// change role of members (only by owner)
router.patch(
    "/:workspaceId/member/:memberId/role",
    protect,
    workspaceController._updateMemberRole,
);

// remove user from workspace (only by owner)
router.delete(
    "/:workspaceId/members/:memberId/remove",
    protect,
    workspaceController._removeUser,
);

// leave workspace (only by editor and viewer)
router.post(
    "/:workspaceId/leave",
    protect,
    workspaceController._leaveWorkspace,
)

export default router;
