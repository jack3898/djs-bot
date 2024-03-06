import { useParams } from 'react-router-dom';
import { trpcReact } from '../trpcReact.js';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    Badge,
    ModeToggle,
    Progress,
    Separator
} from '@/components/ui/index.js';

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

export function JobStatus(): JSX.Element {
    const { id } = useParams();
    const data = trpcReact.queue.useQuery(
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
        <>
            <Card className="max-w-96 mx-auto mt-8">
                <CardHeader>
                    <CardTitle>
                        Job progress <Badge>#{id}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <JobCardContent
                        data={data?.data}
                        error={data.isError}
                        loading={data.isLoading}
                    />
                    <Separator className="my-4" />
                    <ModeToggle />
                </CardContent>
            </Card>
        </>
    );
}
