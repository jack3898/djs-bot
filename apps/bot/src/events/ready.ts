import { Events } from 'discord.js';
import { type BotEvent } from 'types/index.js';

export const ready: BotEvent<Events.ClientReady> = {
    eventName: Events.ClientReady,
    mode: 'once',
    async execute(client): Promise<void> {
        console.log(`Logged in as ${client.user?.tag}`);
    }
};
