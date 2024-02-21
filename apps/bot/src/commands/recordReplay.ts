import { download, sha1hash } from '@bot/utils';
import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { filesModel } from 'mongo';
import { type Command } from 'types';
import { recordReplayQueue } from 'queues';
import { KEYS } from '@bot/queue';
import { env } from 'env';

export const recordReplay: Command = {
    get name(): string {
        return this.definition.name;
    },
    // @ts-expect-error - This is a valid definition, but discord.js types are complaining.
    definition: new SlashCommandBuilder()
        .setName('record-replay')
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
        const replayFileName = interaction.options.get('replay')?.attachment?.name;

        if (!replayUrl) {
            interaction.reply({
                content: 'No replay file was provided.',
                ephemeral: true
            });

            return;
        }

        await interaction.reply('Fetching replay from discord...');

        const replayFile = await download(new URL(replayUrl));
        const replayHash = await sha1hash(replayFile);

        await interaction.editReply('Replay file fetched, saving to db...');

        const fileExists = await filesModel.exists({ shaHash: replayHash });

        // Update the filename of the replay in the db if it already exists
        const replay = fileExists
            ? await filesModel.findOneAndUpdate(
                  { shaHash: replayHash },
                  { filename: replayFileName }
              )
            : await filesModel.create({
                  buffer: replayFile,
                  filename: replayFileName,
                  filetype: 'osr',
                  shaHash: replayHash,
                  ownerId: interaction.user.id
              });

        if (replay) {
            await interaction.editReply('Queueing job to process replay...');

            await recordReplayQueue.add(KEYS.RECORD, {
                executable: env.DANSER_EXECUTABLE_PATH,
                replayId: replay._id.toString(),
                danserOptions: ['--quickstart', `--settings=${env.DANSER_CONFIG_NAME}`]
            });

            console.info(
                `Replay with hash ${replayHash} saved to db. Already existed status: ${!!fileExists}`
            );

            const downloadUrl = new URL(
                `https://${env.S3_BUCKET_NAME}.${env.S3_REGION}.${env.S3_DOMAIN}`
            );

            downloadUrl.pathname = `/${replay._id}.mp4`;

            await interaction.editReply(downloadUrl.toString());

            return;
        }

        await interaction.editReply('Failed to create replay job.');
    }
};
