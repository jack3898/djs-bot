import { Schema } from 'mongoose';

const authSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    tokenType: {
        type: String,
        required: true
    }
});

export const usersSchema = new Schema(
    {
        discordId: {
            type: String,
            required: true
        },
        osuAuth: authSchema,
        docVersion: {
            type: Number,
            required: true,
            default: 1
        },
        plan: {
            type: String,
            required: true,
            default: 'free'
        }
    },
    {
        collection: 'users',
        timestamps: true,
        autoIndex: true
    }
);
