import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpcReact } from '@/trpcReact.js';

export function TrpcProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [queryClient] = useState(() => new QueryClient());

    const [trpcClient] = useState(() =>
        trpcReact.createClient({
            links: [
                httpBatchLink({
                    url: '/trpc',
                    headers: {
                        credentials: 'include'
                    }
                })
            ]
        })
    );

    return (
        <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpcReact.Provider>
    );
}
