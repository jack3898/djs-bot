import { Card, H1, H2 } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';

export function Home(): JSX.Element {
    return (
        <DefaultLayout pageTitle={<H1>Ohssbot Hub</H1>}>
            <H2 className="mb-4">Let us om-nom-nom your replay!</H2>
            <Card className="border-dashed border-2 h-32 flex items-center justify-center">
                <p>Drag and drop coming soon!</p>
            </Card>
            <H2 className="my-4">What is Ohssbot?</H2>
            <p className="mb-4">
                <strong>
                    Ohssbot is a service that allows you to render your Osu! replays at the click of
                    a button.
                </strong>
            </p>
            <p className="mb-4">
                Using our Discord bot, you can upload your replay files and have them rendered into
                videos without the need of using third party tools like OBS to manually record your
                Osu! client. It's that simple!
            </p>
            <p>
                <strong>Ohssbot is currently a big WIP!</strong>
            </p>
        </DefaultLayout>
    );
}
