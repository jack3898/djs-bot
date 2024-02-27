import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { storageModel } from 'mongo';
import { type Command } from 'types';

export const replays: Command = {
    get name(): string {
        return this.definition.name;
    },
    definition: new SlashCommandBuilder()
        .setName('replays')
        .setDescription('Get your replays and their download URLs.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const replays = await storageModel
            .find({ discordOwnerId: interaction.user.id, type: 'mp4' })
            .limit(10)
            .sort({ updatedAt: -1 });

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
                replays.map(({ name, url }) => ({
                    name,
                    value: `[Download ⬇️](${url})`
                }))
            );

        interaction.reply({ embeds: [embed] });
    }
};
