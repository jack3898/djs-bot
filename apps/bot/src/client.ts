import { type ClientOptions, Client as DiscordClient, Collection, REST, Routes } from 'discord.js';
import { env } from 'env.js';
import { type Command } from 'types/index.js';

export class Client extends DiscordClient {
    constructor(options: ClientOptions) {
        super(options);

        this.rest.setToken(env.DISCORD_TOKEN);
    }

    readonly commands = new Collection<PropertyKey, Command>();
    readonly rest = new REST();

    /**
     * Registers a local slash command to later be published to Discord's API.
     */
    async registerSlashCommand(command: Command): Promise<void> {
        this.commands.set(command.name, command);
    }

    /**
     * Publishes all local slash commands registered using registerSlashCommands to Discord's API.
     */
    async publishSlashCommands(): Promise<void> {
        const route = env.GUILD_ID
            ? Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID)
            : Routes.applicationCommands(env.CLIENT_ID);

        if (!env.GUILD_ID) {
            console.warn(
                'No GUILD_ID was provided, this means the commands will be global and may take up to an hour to propagate.'
            );
        }

        await this.rest.put(route, {
            body: this.commands.map((command) => command.definition.toJSON())
        });

        console.log('Successfully registered slash commands.');
    }
}
