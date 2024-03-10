import { Button, Separator } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';
import { trpcReact } from '@/trpcReact.js';

export function Me(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (!data?.authenticated) {
        return (
            <DefaultLayout pageTitle="Not logged in">
                <p>You are not logged in.</p>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout pageTitle="You">
            <p>
                You are currently logged in as <strong>{data?.username}</strong>!
            </p>
            <Separator className="my-4" />
            <Button asChild>
                <a href="/auth/discord/logout">Logout</a>
            </Button>
        </DefaultLayout>
    );
}
