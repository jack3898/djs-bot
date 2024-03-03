import { fastify } from 'server.js';
import { fromMonorepoRoot } from '@bot/utils';
import fastifyStatic from '@fastify/static';

await fastify.register(fastifyStatic, {
    root: fromMonorepoRoot('apps', 'client', 'dist'),
    prefix: '/'
});

fastify.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html');
});
