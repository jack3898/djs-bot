import { fastify } from 'server';
import 'endpoints';

fastify.listen({ port: 80 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
    } else {
        fastify.log.info(`Server listening on ${address}`);
    }
});
