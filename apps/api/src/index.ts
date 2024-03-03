import { fastify } from 'server.js';
import 'endpoints';
import { env } from 'env.js';

fastify.listen({ port: +env.SITE_URL.port || 80 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
    } else {
        fastify.log.info(`Server listening on ${address}`);
    }
});
