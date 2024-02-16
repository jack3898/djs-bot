import { Schema } from 'mongoose';

export const replaysSchema = new Schema(
    {
        buffer: {
            type: Buffer,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        ownerId: {
            type: String,
            required: true,
            index: true
        },
        shaHash: {
            type: String,
            required: true,
            index: true
        },
        docVersion: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        collection: 'replays',
        timestamps: true
    }
);
