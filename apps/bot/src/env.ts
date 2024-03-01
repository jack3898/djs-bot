import { z } from 'zod';
import { getEnvBySchema } from '@bot/utils';
import { zodSchemas } from '@bot/constants';

export const env = await getEnvBySchema(
    z
        .object({})
        .extend(zodSchemas.env.jwtEnv)
        .extend(zodSchemas.env.coreEnv)
        .extend(zodSchemas.env.danserEnv)
        .extend(zodSchemas.env.mongoEnv)
        .extend(zodSchemas.env.keydbEnv)
        .extend(zodSchemas.env.s3Env)
        .extend(zodSchemas.env.osuEnv)
);

console.info('NODE_ENV =', env.NODE_ENV);
console.info('CLIENT_ID =', env.CLIENT_ID);
console.info('GUILD_ID =', env.GUILD_ID);
console.info('DANSER_EXECUTABLE_PATH =', env.DANSER_EXECUTABLE_PATH);
console.info('DANSER_CONFIG_NAME =', env.DANSER_CONFIG_NAME);
