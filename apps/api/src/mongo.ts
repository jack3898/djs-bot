import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI);

const filesModel = mongoose.model('replays', schemas.filesSchema);

export { filesModel };
