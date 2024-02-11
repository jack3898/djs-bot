import { Events, GatewayIntentBits } from 'discord.js';
import * as commands from './commands';
import * as events from './events';
import { Client } from 'client';
import { env } from 'env';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
});

// Register all events
// No point overcomplicating this with loops, just register each event manually there's not going to be a lot!
client[events.ready.mode](Events.ClientReady, events.ready.execute);
client[events.interactionCreate.mode](Events.InteractionCreate, events.interactionCreate.execute);

// Register all commands
// Again, no point overcomplicating this with loops!
client.registerSlashCommand(commands.pong);

// Strap things up!
client.publishSlashCommands();
client.login(env.DISCORD_TOKEN);
