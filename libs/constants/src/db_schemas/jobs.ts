import { Schema } from 'mongoose';

export const jobsSchema = new Schema(
    {
        docVersion: {
            type: Number,
            required: true,
            default: 1
        },
        jobId: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        discordId: {
            type: String,
            required: true
        }
    },
    {
        collection: 'jobs',
        timestamps: true,
        autoIndex: true
    }
);

jobsSchema.set('toJSON', {
    transform: (_, ret) => {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
    }
});

jobsSchema.index({ discordId: 1 });
