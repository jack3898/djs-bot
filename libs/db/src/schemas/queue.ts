import { Schema } from 'mongoose';

export const queueSchema = new Schema({
    test: {
        type: String,
        required: true
    }
});
