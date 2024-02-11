import { type Awaitable, type ClientEvents } from 'discord.js';

export type BotEvent<E extends keyof ClientEvents> = {
    eventName: E;
    mode: 'once' | 'on';
    execute: (...args: ClientEvents[E]) => Awaitable<void>;
};
