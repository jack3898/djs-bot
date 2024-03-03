import { Events } from 'discord.js';
import { isExtendedBot } from 'guards/index.js';
import { type BotEvent } from 'types/index.js';

export const interactionCreate: BotEvent<Events.InteractionCreate> = {
    eventName: Events.InteractionCreate,
    mode: 'on',
    async execute(interaction) {
        if (!interaction.isCommand()) {
            return;
        }

        if (!isExtendedBot(interaction.client)) {
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            return;
        }

        try {
            command.execute(interaction);
        } catch (error) {
            console.error(error);

            interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
        }
    }
};
