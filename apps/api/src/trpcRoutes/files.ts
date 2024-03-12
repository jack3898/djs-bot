import { Bytes } from '@bot/utils';
import { TRPCError } from '@trpc/server';
import { storageModel } from 'mongo.js';
import { s3Storage } from 'storage.js';
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
                    createdAt: z.date(),
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
        }),
    deleteFile: trpc.procedure
        .input(z.string())
        .output(
            z.object({
                id: z.string(),
                name: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const discordUser = await ctx.fetchDiscordUser();

            if (!discordUser) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Not authenticated'
                });
            }

            const file = await storageModel.findOneAndDelete({
                _id: input,
                discordOwnerId: discordUser.id
            });

            if (!file) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'File not found'
                });
            }

            await s3Storage.delete(`${file.sha1Hash}.mp4`);

            return file.toObject({ virtuals: true });
        })
});
