import { trpc } from 'trpc.js';
import { z } from 'zod';

export const queueRouter = trpc.router({
    queue: trpc.procedure
        .input(z.string())
        .output(z.object({ hello: z.string() }))
        .query(() => {
            return { hello: 'world' };
        })
});
