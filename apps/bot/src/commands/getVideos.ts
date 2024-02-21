import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { storageModel } from 'mongo';
import { type Command } from 'types';

export const getVideos: Command = {
    get name(): string {
        return this.definition.name;
    },
    definition: new SlashCommandBuilder()
        .setName('replays')
        .setDescription('Get your replays and their download URLs.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const replays = await storageModel.find(
            { ownerId: interaction.user.id, filetype: 'mp4' },
            undefined,
            { limit: 10, sort: { updatedAt: -1 } }
        );

        console.log(replays);

        if (!replays.length) {
            interaction.reply({
                content: 'You have no replays.',
                ephemeral: true
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Your Replays')
            .setDescription('Here are your replays and their download URLs.')
            .addFields(
                replays.map((replay) => ({
                    name: replay.filename,
                    value: `[Download ⬇️](${replay.url})`
                }))
            );

        interaction.reply({ embeds: [embed] });
    }
};
