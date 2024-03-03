import Fastify from 'fastify';

export const fastify = Fastify({
    logger: true,
    maxParamLength: 5000 // Recommended for TRPC to avoid payload too large errors
});
