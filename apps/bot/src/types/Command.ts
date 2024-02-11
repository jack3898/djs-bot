import { type CommandInteraction, type SlashCommandBuilder } from 'discord.js';

export type Command = {
    name: string;
    definition: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<unknown>;
};
