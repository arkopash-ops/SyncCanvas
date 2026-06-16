import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import * as boardController from "./board.controller"
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// create board (only owner & editor)
router.post(
    "/",
    protect,
    boardController._createBoard,
);

//show all starred board (user specific)
router.get(
    "/starred",
    protect,
    boardController._starredBoard,
);

// last modified boards (workspace-specific)
router.get(
    "/last-modified/:workspaceId",
    protect,
    boardController._lastModifiedBoard,
);

// get board by Id
router.get(
    "/:boardId",
    protect,
    boardController._getBoardById,
);

// rename board (only by owner)
router.patch(
    "/:boardId/rename",
    protect,
    boardController._renameBoard,
);

// update thumbnail
router.patch(
    "/:boardId/thumbnail",
    protect,
    upload.single("thumbnail"),
    boardController._updateThumbnail,
);

// delete board (only by owner)
router.delete(
    "/:boardId",
    protect,
    boardController._deleteBoard,
);

// star toggle (all roles - owner, editor & viewer)
router.patch(
    "/:boardId/star",
    protect,
    boardController._toggleStar,
);

// create duplicate board
router.post(
    "/:boardId/duplicate",
    protect,
    boardController._duplicateBoard,
);

export default router;
