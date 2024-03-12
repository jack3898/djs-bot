import { useParams } from 'react-router-dom';
import { trpcReact } from '../trpcReact.js';
import { H1, H2, Progress } from '@/components/ui/index.js';
import { DefaultLayout } from '@/layout/Default.js';

function JobCardContent({
    data,
    error,
    loading
}: {
    data?: { status: string; progress: string };
    error: boolean;
    loading: boolean;
}): JSX.Element {
    if (loading) {
        return <p>Loading...</p>;
    }

    if (data) {
        return (
            <>
                <p className="flex justify-between">
                    <em>{data.status.toLocaleUpperCase()}</em>
                    <strong>{data.progress}%</strong>
                </p>
                <Progress value={+data.progress} />
            </>
        );
    }

    if (error) {
        return (
            <>
                <p>Hmmm, there was a problem loading this job.</p>
                <p>It might have been deleted, never existed, or there was a problem!</p>
                <p>🤔</p>
            </>
        );
    }

    return <></>;
}

export function Jobs(): JSX.Element {
    const { id } = useParams();
    const data = trpcReact.job.useQuery(
        { jobId: String(id) },
        {
            refetchInterval(data) {
                if (data?.status === 'waiting' || data?.status === 'active') {
                    return 5_000;
                }

                return false;
            },
            retry: 0
        }
    );

    return (
        <DefaultLayout pageTitle={<H1>Job progress</H1>}>
            <H2>Job #{id}</H2>
            <br />
            <JobCardContent data={data?.data} error={data.isError} loading={data.isLoading} />
        </DefaultLayout>
    );
}
