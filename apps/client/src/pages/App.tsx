import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Separator
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';

function LoginWithDiscord(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (data?.authenticated) {
        return (
            <>
                <Separator className="my-4" />
                <Button asChild>
                    <a href="/auth/discord/logout">Logout</a>
                </Button>
            </>
        );
    }

    return (
        <>
            <Separator className="my-4" />
            <Button asChild>
                <a href="/auth/discord/redirect">Continue with Discord</a>
            </Button>
        </>
    );
}

function PageTitle(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (!data?.authenticated) {
        return <CardTitle>Log in</CardTitle>;
    }

    return <CardTitle>Hey, {data?.username}!</CardTitle>;
}

export function App(): JSX.Element {
    return (
        <>
            <Card className="max-w-6xl mx-auto mt-8">
                <CardHeader>
                    <PageTitle />
                </CardHeader>
                <CardContent>
                    <p>This website is in development, and is subject to substantial change!</p>
                    <LoginWithDiscord />
                </CardContent>
            </Card>
        </>
    );
}
