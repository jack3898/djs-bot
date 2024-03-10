import { initTRPC } from '@trpc/server';
import { type createContext } from 'context.js';

export const trpc = initTRPC.context<typeof createContext>().create();
