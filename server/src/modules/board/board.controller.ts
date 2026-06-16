import type { Request, Response, NextFunction } from "express";
import * as boardService from "./board.services";


// create board (only owner & editor)
export const _createBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { workspaceId, title } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        const board = await boardService.createBoard({
            workspaceId,
            userId,
            title
        });

        res.status(201).json({
            success: true,
            message: "Board created successfully.",
            board,
        });
    } catch (error) {
        next(error);
    }
};


//show all starred board (user specific)
export const _starredBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        const board = await boardService.starredBoard(userId);

        res.status(200).json({
            success: true,
            count: board.length,
            board,
        });
    } catch (error) {
        next(error);
    }
};


// get board by Id
export const _getBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;

        const board = await boardService.getBoardById({
            boardId,
            userId,
        });

        res.status(200).json({
            success: true,
            board,
        });
    } catch (error) {
        next(error);
    }
};


// rename board (only by owner)
export const _renameBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        const { title } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const board = await boardService.renameBoard({
            boardId,
            userId: req.user.id,
            title,
        });

        res.status(200).json({
            success: true,
            message: "Board renamed successfully.",
            board,
        });
    } catch (error) {
        next(error);
    }
};


// update thumbnail
export const _updateThumbnail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Thumbnail is required",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const board = await boardService.updateThumbnail(
            boardId,
            req.file.buffer
        );

        if (!board) {
            return res.status(404).json({
                success: false,
                message: "Board not found",
            });
        }

        res.status(200).json({
            success: true,
            thumbnail: board.thumbnail,
            thumbnailPublicId: board.thumbnailPublicId,
        });
    } catch (error) {
        next(error);
    }
};


// delete board (only by owner)
export const _deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await boardService.deleteBoard(boardId, req.user.id);

        return res.status(200).json({
            success: true,
            message: "Board deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// star toggle (all roles - owner, editor & viewer)
export const _toggleStar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const board =
            await boardService.toggleStar(
                boardId,
                req.user.id,
            );

        res.status(200).json({
            success: true,
            message: "Board star updated.",
            board,
        });
    } catch (error) {
        next(error);
    }
};


// create duplicate board
export const _duplicateBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (!boardId || Array.isArray(boardId)) {
            return res.status(400).json({ message: "Invalid board Id" });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const board = await boardService.duplicateBoard(
            boardId,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Board has been duplicated.",
            board
        });
    } catch (error) {
        next(error);
    }
};


// last modified boards (workspace-specific)
export const _lastModifiedBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { workspaceId } = req.params;
        if (!workspaceId || Array.isArray(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace Id" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const limit = parseInt(req.query.limit as string) || 3;

        const boards = await boardService.lastModifiedBoard(
            workspaceId,
            req.user.id,
            limit
        );

        res.status(200).json({
            success: true,
            count: boards.length,
            board: boards,
        });
    } catch (error) {
        next(error);
    }
};
