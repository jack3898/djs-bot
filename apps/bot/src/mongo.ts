import mongoose from 'mongoose';
import { env } from './env';
import { schemas } from '@bot/db';

await mongoose.connect(env.MONGO_URI.toString());

export const storageModel = mongoose.model('storage', schemas.storageSchema);
export const usersModel = mongoose.model('users', schemas.usersSchema);
