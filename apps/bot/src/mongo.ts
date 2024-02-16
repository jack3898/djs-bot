import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI);

export const queueModel = mongoose.model('queue', schemas.queueSchema);

export const replaysModel = mongoose.model('replays', schemas.replaysSchema);
