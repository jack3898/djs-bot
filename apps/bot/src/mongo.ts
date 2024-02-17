import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI.toString());

export const filesModel = mongoose.model('files', schemas.filesSchema);
