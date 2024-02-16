import Fastify from 'fastify';
import { queueModel } from 'mongo';

const fastify = Fastify({ logger: true });

fastify.get('/', async (_, reply) => {
    await queueModel.create({ test: 'ok!' });
    const queue = await queueModel.find();

    reply.send(queue);
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
    } else {
        fastify.log.info(`server listening on ${address}`);
    }
});
