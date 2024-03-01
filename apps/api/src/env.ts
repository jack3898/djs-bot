import { z } from 'zod';
import { getEnv, jwtEnv, mongoEnv, osuEnv } from '@bot/utils';

export const env = await getEnv(z.object({}).extend(jwtEnv).extend(mongoEnv).extend(osuEnv));
