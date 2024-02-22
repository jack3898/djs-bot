import { download, sha1hash } from '@bot/utils';
import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { storageModel } from 'mongo';
import { type Command } from 'types';
import { recordReplayQueue } from 'queues';
import { KEYS } from '@bot/queue';
import { env } from 'env';
import { s3Client } from 'storage';
import { uploadToObjectStorage } from '@bot/storage';

export const recordReplay: Command = {
    get name(): string {
        return this.definition.name;
    },
    // @ts-expect-error - This is a valid definition, but discord.js types are complaining.
    definition: new SlashCommandBuilder()
        .setName('render')
        .setDescription('Generate an Osu! replay using Danser.')
        .addAttachmentOption((option) => {
            return option
                .setName('replay')
                .setDescription('The Osu! replay file to generate the video from.')
                .setRequired(true);
        }),
    async execute(interaction: CommandInteraction): Promise<void> {
        // Discord CDN URL to the replay file
        const replayUrl = interaction.options.get('replay')?.attachment?.url;
        const replayFilename = interaction.options.get('replay')?.attachment?.name;

        if (!replayUrl) {
            interaction.reply({
                content: 'No replay file was provided.',
                ephemeral: true
            });

            return;
        }

        await interaction.reply('Fetching replay from discord...');

        const replayFile = await download(new URL(replayUrl));
        const fileHash = await sha1hash(replayFile);
        const storageReplayFilename = `${fileHash}.osr`;

        await interaction.editReply('Replay file fetched, saving...');

        await uploadToObjectStorage(
            s3Client,
            env.S3_BUCKET_NAME,
            storageReplayFilename,
            replayFile
        );

        const fileExists = await storageModel.exists({ sha1Hash: fileHash });

        const downloadReplayUrl = new URL(
            `https://${env.S3_BUCKET_NAME}.${env.S3_REGION}.${env.S3_DOMAIN}`
        );
        downloadReplayUrl.pathname = `/${fileHash}.osr`;

        // Update the filename of the replay in the db if it already exists
        const file = fileExists
            ? await storageModel.findOneAndUpdate({ sha1Hash: fileHash }, { name: replayFilename })
            : await storageModel.create({
                  url: downloadReplayUrl.toString(),
                  name: replayFilename,
                  type: 'osr',
                  size: replayFile.byteLength,
                  sha1Hash: fileHash,
                  discordOwnerId: interaction.user.id
              });

        if (file) {
            await interaction.editReply('Queueing job to process replay...');

            await recordReplayQueue.add(KEYS.RECORD, {
                executable: env.DANSER_EXECUTABLE_PATH,
                fileId: file._id.toString(),
                friendlyName: String(replayFilename),
                danserOptions: ['--quickstart', `--settings=${env.DANSER_CONFIG_NAME}`]
            });

            console.info(
                `Replay with hash ${fileHash} saved to db. Already existed status: ${!!fileExists}`
            );

            await interaction.editReply(
                'Added to the queue! Use /replays to see it. It will not be available immediately.'
            );

            return;
        }

        await interaction.editReply('Failed to create replay job.');
    }
};
