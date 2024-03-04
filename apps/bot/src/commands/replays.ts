import { createLoginWithOsuButton } from 'components/index.js';
import {
    type CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder
} from 'discord.js';
import { isOsuAuthenticated } from 'guards/index.js';
import { storageModel } from 'mongo.js';
import { type Command } from 'types/index.js';

export const replays: Command = {
    get name(): string {
        return this.definition.name;
    },
    definition: new SlashCommandBuilder()
        .setName('replays')
        .setDescription('Get your replays and their download URLs.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const osuAuthenticated = await isOsuAuthenticated(interaction);

        if (!osuAuthenticated) {
            const authButton = await createLoginWithOsuButton(interaction.user.id);
            const actionRow = new ActionRowBuilder().addComponents(authButton);

            await interaction.reply({
                content: 'You are not authenticated. Click the button to link your Osu! account.',
                // @ts-expect-error - This is a valid interaction reply, but discord.js types are complaining.
                components: [actionRow],
                ephemeral: true
            });

            return;
        }

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
