import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/index.js';

export function App(): JSX.Element {
    return (
        <>
            <Card className="max-w-96 mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Whoa, there!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>More of the website is on the way!</p>
                    <p>For now, enjoy this chicken: 🐔</p>
                </CardContent>
            </Card>
        </>
    );
}
