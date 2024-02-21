import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI);

export const storageModel = mongoose.model('storage', schemas.storageSchema);