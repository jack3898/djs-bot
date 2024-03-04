import { type CommandInteraction, SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import { type Command } from 'types/index.js';
import { createLoginWithOsuButton } from 'components/index.js';

export const auth: Command = {
    get name(): string {
        return this.definition.name;
    },
    definition: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Associate your Discord account with your Osu! account through this bot.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const authButton = await createLoginWithOsuButton(interaction.user.id);
        const actionRow = new ActionRowBuilder().addComponents(authButton);

        await interaction.reply({
            content:
                'Click the button to link your Osu! account. The bot will not have access to your password, and only use the the account to fetch beatmap details from your uploaded replays.',
            // @ts-expect-error - This is a valid interaction reply, but discord.js types are complaining.
            components: [actionRow],
            ephemeral: true
        });
    }
};
