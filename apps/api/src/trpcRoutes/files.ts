import { Bytes } from '@bot/utils';
import { TRPCError } from '@trpc/server';
import { storageModel } from 'mongo.js';
import { trpc } from 'trpc.js';
import { z } from 'zod';

export const filesRouter = trpc.router({
    userFiles: trpc.procedure
        .output(
            z.array(
                z.object({
                    id: z.string(),
                    url: z.string(),
                    name: z.string(),
                    size: z.number().transform((val) => {
                        return Bytes.fromB(val).mBFriendly;
                    })
                })
            )
        )
        .query(async ({ ctx }) => {
            const discordUser = await ctx.fetchDiscordUser();

            if (!discordUser) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Not authenticated'
                });
            }

            const files = await storageModel
                .find({ discordOwnerId: discordUser.id, type: 'mp4' })
                .sort({ createdAt: -1 });

            return files.map((doc) => doc.toObject({ virtuals: true }));
        })
});
