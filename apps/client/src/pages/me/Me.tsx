import { Button, H1, Separator } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';
import { trpcReact } from '@/trpcReact.js';
import { UserDownloads } from './UserDownloads.js';
import { UserJobs } from './UserJobs.js';

export function Me(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (!data) {
        return (
            <DefaultLayout pageTitle="Not logged in">
                <p>You are not logged in.</p>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout pageTitle={<H1>Your Account</H1>}>
            <p>
                You are currently logged in as <strong>{data?.username}</strong>!
            </p>
            <Separator className="my-4" />
            <UserJobs />
            <UserDownloads />
            <Separator className="my-4" />
            <Button asChild>
                <a href="/auth/discord/logout">Logout</a>
            </Button>
        </DefaultLayout>
    );
}
