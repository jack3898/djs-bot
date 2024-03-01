import { z } from 'zod';

export const osuOAuthJwtSchema = z.object({
    discordId: z.string()
});
