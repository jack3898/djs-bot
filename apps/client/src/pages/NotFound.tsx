import { H1 } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';

export function NotFound(): JSX.Element {
    return (
        <DefaultLayout pageTitle={<H1>404 (A.K.A. Not Found)</H1>}>
            <p>We searched far and wide, but nothing. ☹️</p>
        </DefaultLayout>
    );
}
