import mongoose from "mongoose";
import WorkspaceModel from "../workspace/workspace.model";
import BoardModel from "./board.model";
import type { CreateBoardInput, GetBoardByIdInput, RenameBoardInput } from "./types/board.types";


// create board (only owner)
export const createBoard = async ({
    workspaceId,
    userId,
    title
}: CreateBoardInput) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === userId);
    if (!member) {
        const err = new Error("You are not the member of this Workspace.");
        (err as any).statusCode = 403;
        throw err;
    }

    if (member.role !== "owner") {
        const err = new Error("Only Workspace owner can create Board.");
        (err as any).statusCode = 403;
        throw err;
    }

    const board = await BoardModel.create({
        workspaceId,
        ownerId: userId,
        title,
    });

    return board;
};


//show all starred board (user specific)
export const StarredBoard = async (userId: string) => {
    const boards = await BoardModel.find({
        starredBy: userId,
        isActive: true,
    })
        .select("_id title thumbnail workspaceId updatedAt")
        .populate("workspaceId", "name image")
        .sort({ updatedAt: -1 });

    return boards;
};


// get board by Id
export const getBoardById = async ({
    boardId,
    userId
}: GetBoardByIdInput) => {
    const board = await BoardModel.findById(boardId);
    if (!board || !board.isActive) {
        const err = new Error("Board not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(board.workspaceId);
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === userId);
    if (!member) {
        const err = new Error("Access denied.");
        (err as any).statusCode = 403;
        throw err;
    }

    return board;
};


// rename board (only by owner)
export const renameBoard = async ({
    boardId,
    userId,
    title,
}: RenameBoardInput) => {
    const board = await BoardModel.findById(boardId);
    if (!board || !board.isActive) {
        const err = new Error("Board not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(board.workspaceId);
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === userId);
    if (!member || member.role !== "owner") {
        const err = new Error("Only Workspace owner can rename Board.");
        (err as any).statusCode = 403;
        throw err;
    }

    board.title = title;

    await board.save();
    return board;
};


// delete board (only by owner)
export const deleteBoard = async (
    boardId: string,
    userId: string,
) => {
    const board = await BoardModel.findById(boardId);
    if (!board) {
        const err = new Error("Board not found");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(board.workspaceId);
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === userId);
    if (!member || member.role !== "owner") {
        const err = new Error("ou don't have permission to delete Workspace.");
        (err as any).statusCode = 403;
        throw err;
    }

    await BoardModel.findByIdAndDelete(boardId);
    return true;
};


// star toggle (all roles - owner, editor & viewer)
export const toggleStar = async (
    boardId: string,
    userId: string
) => {
    const board = await BoardModel.findById(boardId);
    if (!board || !board.isActive) {
        const err = new Error("Board not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(board.workspaceId)
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const member = workspace.members.find((m) => m.userId.toString() === userId)
    if (!member) {
        const err = new Error("Access denied.");
        (err as any).statusCode = 403;
        throw err;
    }

    const isStarred = board.starredBy.some((id) => id.toString() === userId);
    if (isStarred) {
        board.starredBy = board.starredBy.filter((id) => id.toString() !== userId);
    } else {
        board.starredBy.push(new mongoose.Types.ObjectId(userId));
    }

    await board.save();
    return board;
};


// create duplicate board
export const duplicateBoard = async (
    boardId: string,
    userId: string
) => {
    const board = await BoardModel.findById(boardId);
    if (!board || !board.isActive) {
        const err = new Error("Board not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const workspace = await WorkspaceModel.findById(board.workspaceId);
    if (!workspace || !workspace.isActive) {
        const err = new Error("Workspace not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    let role: string | null = null;

    if (workspace.owner.toString() === userId) {
        role = "owner";
    } else {
        const member = workspace.members.find(
            (m) => m.userId.toString() === userId
        );

        role = member?.role ?? null;
    }

    if (role !== "owner" && role !== "editor") {
        const err = new Error("Access denied.");
        (err as any).statusCode = 403;
        throw err;
    }

    const duplicated = BoardModel.create({
        workspaceId: board.workspaceId,
        ownerId: userId,
        title: `${board.title} (copy)`,
        thumbnail: board.thumbnail,
        ...(board.snapshot && {
            snapshot: board.snapshot,
        }),
    });

    return duplicated;
};
