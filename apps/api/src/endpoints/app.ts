import { fastify } from 'server.js';

fastify.get('/app*', () => {
    return { message: 'This route is not yet active.' };
});
