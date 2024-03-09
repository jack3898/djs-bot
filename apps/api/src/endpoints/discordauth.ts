import { env } from 'env.js';
import { fastify } from 'server.js';
import { z } from 'zod';

const getParamsSchema = z.object({
    code: z.string(),
    state: z.string()
});

const stateList = new Set<string>(); // TODO: Use a cache with TTL

function getRedirectUri(): string {
    const redirectUri = new URL(env.DISCORD_REDIRECT_URI);

    redirectUri.pathname = 'auth/discord/callback';

    return decodeURIComponent(redirectUri.toString());
}

// This endpoint will redirect the user to Discord's OAuth2 page with state
fastify.get('/auth/discord/redirect', async (request, reply) => {
    const newUrl = new URL('https://discord.com/oauth2/authorize');
    const state = crypto.randomUUID();

    newUrl.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI.toString());
    stateList.add(state);

    const searchParams = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        response_type: 'code',
        redirect_uri: getRedirectUri(),
        scope: 'identify',
        state
    });

    newUrl.search = searchParams.toString();

    reply.redirect(newUrl.toString());
});

const accessTokenResponseSchema = z.object({
    access_token: z.string(),
    token_type: z.literal('Bearer'),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string()
});

// They have authorized the app, and discord has redirected them here. Now we can exchange the code for a token
// And set the user's session cookie
fastify.get('/auth/discord/callback', async (request, reply) => {
    const getParams = await getParamsSchema.safeParseAsync(request.query);

    if (!getParams.success) {
        reply.status(400).send({ error: 'Missing code parameter from callback URL.' });

        return;
    }

    const { code, state } = getParams.data;

    if (!stateList.has(state)) {
        reply.status(400).send({ error: 'Invalid state parameter from callback URL.' });

        return;
    }

    stateList.delete(state);

    // Exchange code for token
    const url = new URL('https://discord.com/api/v10/oauth2/token');

    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            client_id: env.DISCORD_CLIENT_ID,
            client_secret: env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: getRedirectUri()
        }).toString()
    });

    const json = await response.json();
    const accessToken = await accessTokenResponseSchema.safeParseAsync(json);

    if (!accessToken.success) {
        reply.status(500).send({ error: 'Failed to get access token from Discord OAuth.' });

        console.error({ json, error: accessToken.error });

        return;
    }

    reply.header(
        'Set-Cookie',
        `discordAccessToken=${accessToken.data.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    reply.redirect('/');
});

fastify.get('/auth/discord/test', async (request) => {
    const accessToken = request.headers.cookie
        ?.match(/(?<=discordAccessToken=)[a-zA-Z0-9]*/)
        ?.at(0);

    const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    });

    return userResult.json();
});
