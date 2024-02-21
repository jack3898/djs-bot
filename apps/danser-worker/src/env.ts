import { z } from 'zod';
import { getEnv, keydbEnv, mongoEnv, s3Env } from '@bot/utils';

export const env = await getEnv(z.object({}).extend(mongoEnv).extend(keydbEnv).extend(s3Env));
