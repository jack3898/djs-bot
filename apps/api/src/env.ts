import { z } from 'zod';
import { getEnvBySchema } from '@bot/utils';
import { zodSchemas } from '@bot/constants';

export const env = await getEnvBySchema(
    z
        .object({})
        .extend(zodSchemas.env.discordEnv)
        .extend(zodSchemas.env.siteEnv)
        .extend(zodSchemas.env.coreEnv)
        .extend(zodSchemas.env.jwtEnv)
        .extend(zodSchemas.env.mongoEnv)
        .extend(zodSchemas.env.osuEnv)
        .extend(zodSchemas.env.keydbEnv)
        .extend(zodSchemas.env.s3Env)
);
