import { JWT } from '@bot/utils';
import { env } from './env.js';
import { zodSchemas } from '@bot/constants';

export const jwt = new JWT(env.JWT_SECRET, zodSchemas.jwt.osuOAuthJwtSchema);
