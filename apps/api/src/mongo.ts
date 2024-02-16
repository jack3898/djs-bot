import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI);

const queueModel = mongoose.model('queue', schemas.queueSchema);

await queueModel.ensureIndexes();

export { queueModel };
