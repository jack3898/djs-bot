import { z } from 'zod';
import { getEnv, mongoEnv } from '@bot/utils';

export const env = await getEnv(z.object({}).extend(mongoEnv));
