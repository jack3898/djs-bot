import { DefaultLayout } from '@/layout/Default.js';

export function NotFound(): JSX.Element {
    return (
        <DefaultLayout pageTitle="Not Found">
            <p>We searched far and wide, but nothing. ☹️</p>
        </DefaultLayout>
    );
}
