import { download } from '@bot/utils';
import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { replaysModel } from 'mongo';
import { type Command } from 'types';
import { createHash } from 'crypto';
import { recordReplayQueue } from 'queues';

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
        const replayHash = createHash('sha256').update(replayFile).digest('hex');

        await interaction.editReply('Replay file fetched, saving to db...');

        const fileExists = await replaysModel.exists({ shaHash: replayHash });

        // Update the filename of the replay in the db if it already exists
        const replay = fileExists
            ? await replaysModel.findOneAndUpdate(
                  { shaHash: replayHash },
                  { filename: replayFileName }
              )
            : await replaysModel.create({
                  buffer: replayFile,
                  filename: replayFileName,
                  shaHash: replayHash,
                  ownerId: interaction.user.id
              });

        if (replay) {
            await interaction.editReply('Queueing job to process replay...');

            await recordReplayQueue.add({
                executable: process.env.DANSER_EXECUTABLE_PATH,
                replayId: replay._id,
                danserOptions: [
                    '--quickstart',
                    `--out=${replayHash}`,
                    `--settings=${process.env.DANSER_CONFIG_NAME}`
                ]
            });
        }

        console.info(
            `Replay with hash ${replayHash} saved to db. Already existed status: ${!!fileExists}`
        );

        await interaction.editReply('Queue job created!');
    }
};
