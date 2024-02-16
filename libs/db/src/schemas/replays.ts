import { Schema } from 'mongoose';

const replaysSchema = new Schema(
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
            required: true
        },
        shaHash: {
            type: String,
            required: true
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

replaysSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // 24 hours
replaysSchema.index({ ownerId: 1, shaHash: 1 }, { unique: true });

export { replaysSchema };
