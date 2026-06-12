import mongoose, { Schema } from "mongoose";
import * as Y from "yjs";
import type { IBoard } from "./types/board.types";

const createInitialYjsState = () => {
    const doc = new Y.Doc();
    return Buffer.from(Y.encodeStateAsUpdate(doc));
};

const BoardSchema = new Schema<IBoard>({
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },

    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    thumbnail: {
        type: String,
        default: null,
    },

    thumbnailPublicId: {
        type: String,
        default: null,
    },

    starredBy: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },

    lastEditedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    snapshot: {
        type: {
            yjsState: {
                type: Schema.Types.Buffer,
                required: false,
            },

            updatedAt: {
                type: Date,
                required: false,
            },
        },

        default: () => ({
            yjsState: createInitialYjsState(),
            updatedAt: Date.now(),
        }),
    },
}, { timestamps: true });

BoardSchema.index({ workspaceId: 1 });
BoardSchema.index({ ownerId: 1 });
BoardSchema.index({ isActive: 1 });

const BoardModel =
    (mongoose.models.Board as mongoose.Model<IBoard>) ||
    mongoose.model<IBoard>("Board", BoardSchema);

export default BoardModel;
