import { fastify } from 'server.js';
import { z } from 'zod';
import { env } from 'env.js';
import { usersModel } from 'mongo.js';
import { jwt } from 'jwt.js';
import TTLCache from '@isaacs/ttlcache';
import { fetchDiscordUser } from 'utils/getDiscordUserByToken.js';

// This is a simple in-memory cache to store the state parameter from the OAuth2 redirect
// When the user is redirected back to the app, we can verify that the state is valid
// Then we delete it from the cache
const stateList = new TTLCache<string, boolean>({
    ttl: 1_000 * 60 * 5, // 5 minutes
    max: 10_000 // Extreme, but just in case
});

const getParamsSchema = z.object({
    code: z.string(),
    state: z.string()
});

const oauthTokenSchema = z.object({
    token_type: z.literal('Bearer'),
    expires_in: z.number().transform((secondsInTheFuture) => {
        const millisecondsInTheFuture = secondsInTheFuture * 1000;

        return new Date(Date.now() + millisecondsInTheFuture);
    }),
    access_token: z.string(),
    refresh_token: z.string()
});

fastify.get('/auth/osu/redirect', async (request, reply) => {
    const user = await fetchDiscordUser(request.headers.cookie || '');

    if (!user || !user.authenticated) {
        reply
            .status(401)
            .send({ error: 'You need to be logged in with Discord before you can proceed.' });

        return;
    }

    const state = await jwt.sign({ discordId: user.id });

    stateList.set(state, true);

    const searchParams = new URLSearchParams({
        client_id: env.OSU_CLIENT_ID,
        redirect_uri: env.OSU_REDIRECT_URI.toString(),
        response_type: 'code',
        scope: 'public',
        state
    });

    const osuOauthRedirectUrl = new URL('https://osu.ppy.sh/oauth/authorize');

    osuOauthRedirectUrl.search = searchParams.toString();

    reply.redirect(osuOauthRedirectUrl.toString());
});

/**
 * @see https://osu.ppy.sh/docs/index.html#authorization-code-grant
 */
fastify.get('/auth/osu/callback', async (request, reply) => {
    const getParams = await getParamsSchema.safeParseAsync(request.query);

    if (!getParams.success) {
        reply.status(400).send({ error: 'Missing code parameter from callback URL.' });

        return;
    }

    if (!stateList.has(getParams.data.state)) {
        reply.status(400).send({ error: 'Invalid state parameter from callback URL.' });

        return;
    }

    stateList.delete(getParams.data.state);

    // State is a JWT, it cannot be forged and contains the user's Discord ID
    // A JWT is used over a standard random value, as the bot needs to know the user's Discord ID
    // TODO: Use a cache with TTL
    const state = await jwt.verify(getParams.data.state);

    const { code } = getParams.data;

    // get token from Osu! OAuth
    const response = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'Content-Type: application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: env.OSU_CLIENT_ID,
            client_secret: env.OSU_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: env.OSU_REDIRECT_URI.toString()
        })
    });

    const json = await response.json();
    const accessTokenVerify = await oauthTokenSchema.safeParseAsync(json);

    if (!accessTokenVerify.success) {
        reply.status(500).send({ error: 'Failed to get access token from Osu! OAuth.' });

        console.error({ json, error: accessTokenVerify.error });

        return;
    }

    const existingUser = await usersModel.findOne({
        discordId: state.discordId
    });

    const set = {
        authToken: accessTokenVerify.data.access_token,
        discordId: state.discordId,
        osuAuth: {
            accessToken: accessTokenVerify.data.access_token,
            refreshToken: accessTokenVerify.data.refresh_token,
            expires: accessTokenVerify.data.expires_in,
            tokenType: accessTokenVerify.data.token_type
        }
    };

    if (existingUser) {
        await usersModel.updateOne({ discordId: state.discordId }, { $set: set });

        await reply.send(
            'Authentication status updated! You can close this tab now and head back to Discord. 🥳'
        );

        return;
    }

    // test response
    await usersModel.create({
        ...set,
        plan: 'free'
    });

    await reply.send('Authenticated! You can close this tab now and head back to Discord. 🥳');
});
