import { fastify } from 'server';
import { z } from 'zod';
import { env } from 'env';
import { usersModel } from 'mongo';

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

/**
 * @see https://osu.ppy.sh/docs/index.html#authorization-code-grant
 */
fastify.get('/osucallback', async (request, reply) => {
    const getParams = await getParamsSchema.safeParseAsync(request.query);

    if (!getParams.success) {
        reply.status(400).send({ error: 'Missing code parameter from callback URL.' });

        return;
    }

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

    console.log('Osu! OAuth token:', accessTokenVerify.data);

    const existingUser = await usersModel.findOne({
        discordId: getParams.data.state
    });

    const set = {
        authToken: accessTokenVerify.data.access_token,
        discordId: getParams.data.state,
        osuAuth: {
            accessToken: accessTokenVerify.data.access_token,
            refreshToken: accessTokenVerify.data.refresh_token,
            expires: accessTokenVerify.data.expires_in,
            tokenType: accessTokenVerify.data.token_type
        }
    };

    if (existingUser) {
        await usersModel.updateOne({ discordId: getParams.data.state }, { $set: set });

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
