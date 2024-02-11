import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { type Command } from 'types/Command';

export const pong: Command = {
    get name(): string {
        return this.definition.name;
    },
    definition: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('Replies with Pong! This is a test.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        interaction.reply('🏓');
    }
};
