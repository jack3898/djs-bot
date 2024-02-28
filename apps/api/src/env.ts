import { z } from 'zod';
import { getEnv, mongoEnv, osuEnv } from '@bot/utils';

export const env = await getEnv(z.object({}).extend(mongoEnv).extend(osuEnv));
