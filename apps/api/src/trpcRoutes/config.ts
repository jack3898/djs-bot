import { env } from 'env.js';
import { trpc } from 'trpc.js';
import { z } from 'zod';

export const configRouter = trpc.router({
    config: trpc.procedure.output(z.object({ discordAuthCallback: z.string() })).query(async () => {
        const newUrl = new URL('https://discord.com/oauth2/authorize');

        newUrl.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI.toString());

        const newRedirectUri = new URL(env.DISCORD_REDIRECT_URI);

        newRedirectUri.pathname = 'auth/discord';

        const searchParams = new URLSearchParams({
            client_id: env.DISCORD_CLIENT_ID,
            response_type: 'code',
            redirect_uri: decodeURIComponent(newRedirectUri.toString()),
            scope: 'identify'
        });

        newUrl.search = searchParams.toString();

        return {
            discordAuthCallback: newUrl.toString()
        };
    })
});
