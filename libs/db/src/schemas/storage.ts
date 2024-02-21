import { Schema } from 'mongoose';

const storageSchema = new Schema(
    {
        url: {
            type: String,
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

storageSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 10 });
storageSchema.index({ shaHash: 1 }, { unique: true });
storageSchema.index({ ownerId: 1 });

export { storageSchema };
