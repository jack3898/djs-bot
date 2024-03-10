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

storageSchema.index({ discordOwnerId: 1 });

storageSchema.set('toJSON', {
    transform: (_, ret) => {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
    }
});

export { storageSchema };
