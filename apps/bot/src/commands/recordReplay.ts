import { download } from '@bot/utils';
import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { replaysModel } from 'mongo';
import { type Command } from 'types/Command';
import { createHash } from 'crypto';

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

        // Update the filename of the replay in the db if it already exists
        if (await replaysModel.exists({ shaHash: replayHash })) {
            await replaysModel.findOneAndUpdate(
                { shaHash: replayHash },
                { filename: replayFileName }
            );

            await interaction.editReply('Replay already exists in db, updated filename.');

            return;
        }

        const queueItem = await replaysModel.create({
            buffer: replayFile,
            filename: replayFileName,
            shaHash: replayHash,
            ownerId: interaction.user.id
        });

        await interaction.editReply(`Replay saved to db with ID: ${queueItem._id}`);
    }
};
