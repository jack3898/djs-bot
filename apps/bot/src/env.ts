import { z } from 'zod';
import { coreEnv, danserEnv, getEnv, keydbEnv, mongoEnv, s3Env } from '@bot/utils';

export const env = await getEnv(
    z.object({}).extend(coreEnv).extend(danserEnv).extend(mongoEnv).extend(keydbEnv).extend(s3Env)
);

console.info('NODE_ENV =', env.NODE_ENV);
console.info('CLIENT_ID =', env.CLIENT_ID);
console.info('GUILD_ID =', env.GUILD_ID);
console.info('DANSER_EXECUTABLE_PATH =', env.DANSER_EXECUTABLE_PATH);
console.info('DANSER_CONFIG_NAME =', env.DANSER_CONFIG_NAME);
