import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
    } else {
        fastify.log.info(`server listening on ${address}`);
    }
});
