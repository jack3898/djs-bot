import { Schema } from 'mongoose';

const filesSchema = new Schema(
    {
        buffer: {
            type: Buffer,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        filetype: {
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
        collection: 'files',
        timestamps: true,
        autoIndex: true
    }
);

filesSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 10 });
filesSchema.index({ shaHash: 1 }, { unique: true });
filesSchema.index({ ownerId: 1 });

export { filesSchema };
