import { Button, H1 } from '@/components/ui/index.js';
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
        <DefaultLayout pageTitle={<H1>Sign up!</H1>}>
            <p className="mb-4">
                Log in with Discord to get the most out of Ohssbot, link renders to your account and
                more!
            </p>
            <LoginWithDiscord />
        </DefaultLayout>
    );
}
