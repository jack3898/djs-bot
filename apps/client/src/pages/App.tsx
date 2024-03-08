import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Separator
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { Link } from 'react-router-dom';

export function App(): JSX.Element {
    const data = trpcReact.config.useQuery();

    return (
        <>
            <Card className="max-w-6xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Ohss bot</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This website is in development, and is subject to substantial change!</p>
                    <Separator className="my-4" />
                    <Button asChild>
                        <Link to={data.data?.discordAuthCallback || ''}>Log in with Discord</Link>
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
