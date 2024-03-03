import { fastify } from 'server.js';
import { fromMonorepoRoot } from '@bot/utils';
import fastifyStatic from '@fastify/static';
import { env } from 'env.js';

await fastify.register(fastifyStatic, {
    root: fromMonorepoRoot('apps', 'client', 'dist'),
    prefix: '/',
    constraints: {
        host: env.SITE_URL.host
    }
});

fastify.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html');
});
