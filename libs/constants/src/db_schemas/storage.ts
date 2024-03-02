import { osuReplayVideoFileLifecycleTimeSeconds } from '../common';
import { Schema } from 'mongoose';

const storageSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        discordOwnerId: {
            type: String,
            required: true
        },
        sha1Hash: {
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
        collection: 'files',
        timestamps: true,
        autoIndex: true
    }
);

storageSchema.index(
    { updatedAt: 1 },
    { expireAfterSeconds: osuReplayVideoFileLifecycleTimeSeconds }
);
storageSchema.index({ sha1Hash: 1 }, { unique: true });
storageSchema.index({ discordOwnerId: 1 });

export { storageSchema };
