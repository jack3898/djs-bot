import Fastify from 'fastify';
import { filesModel } from 'mongo';
import { z } from 'zod';

const fastify = Fastify({ logger: true });

const requestParamsSchema = z.object({
    id: z.string()
});

fastify.get('/replays/:id', async (req, reply) => {
    const params = requestParamsSchema.parse(req.params);
    const file = await filesModel.findOne({ _id: params.id, filetype: 'mp4' });

    if (!file) {
        reply.status(404);

        return { error: 'File not found. It is either in the works, or is just simply not found!' };
    }

    // send the file to the user
    const buffer = file.buffer;

    reply.status(200);
    reply.header('Content-Disposition', `attachment; filename="${file.filename}"`);
    reply.header('Content-Type', 'application/octet-stream');
    reply.send(buffer);
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
    } else {
        fastify.log.info(`server listening on ${address}`);
    }
});
