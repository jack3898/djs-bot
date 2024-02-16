import { Schema } from 'mongoose';

export const queueSchema = new Schema(
    {
        replayId: {
            type: Schema.ObjectId,
            required: true,
            ref: 'replays'
        },
        ownerId: {
            type: String,
            required: true
        }
    },
    {
        collection: 'queue',
        timestamps: true
    }
);
