import { Events, GatewayIntentBits } from 'discord.js';
import * as commands from './commands';
import { Client } from 'client';
import { env } from 'env';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user?.tag}`);
});

client.registerSlashCommand(commands.pong);

client.publishSlashCommands();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

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
});

client.login(env.DISCORD_TOKEN);
