import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Separator
} from '@/components/ui/index.js';

export function App(): JSX.Element {
    return (
        <>
            <Card className="max-w-6xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Ohss bot</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This website is in development, and is subject to substantial change!</p>
                    <Separator className="my-4" />
                    <Button>Log in with Discord</Button>
                </CardContent>
            </Card>
        </>
    );
}
