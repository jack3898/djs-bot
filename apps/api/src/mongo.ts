import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI);

const storageModel = mongoose.model('replays', schemas.storageSchema);

export { storageModel };
