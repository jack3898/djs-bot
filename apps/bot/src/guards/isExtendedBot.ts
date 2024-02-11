import { Client } from 'client';
import { type Client as DiscordClient } from 'discord.js';

/**
 * This application extends the `discord.js` `Client` class to add custom functionality.
 *
 * This is useful when you pull the client out of a discord.js object, such as an interaction which types that client as the raw client.
 * This type guard tells TypeScript that the client is an instance of our custom `Client` class, not the raw `discord.js` `Client` class.
 */
export function isExtendedBot(bot: DiscordClient): bot is Client {
    if (bot instanceof Client) {
        return true;
    }

    console.error(
        'The bot is not an client instance is not correct. This is a bug and needs to be fixed.'
    );

    return false;
}
