import { Button, Separator } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';
import { trpcReact } from '@/trpcReact.js';

function LoginWithDiscord(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (data?.authenticated) {
        return (
            <Button asChild>
                <a href="/auth/discord/logout">Logout</a>
            </Button>
        );
    }

    return (
        <Button asChild>
            <a href="/auth/discord/redirect">Continue with Discord</a>
        </Button>
    );
}

export function Signup(): JSX.Element {
    return (
        <DefaultLayout pageTitle="Sign up">
            <Separator className="my-4" />
            <LoginWithDiscord />
        </DefaultLayout>
    );
}
