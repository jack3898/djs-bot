import { useParams } from 'react-router-dom';
import { trpcReact } from '../trpcReact.js';
import { useEffect, useMemo } from 'react';

export function JobStatus(): JSX.Element {
    const { id } = useParams();
    const data = trpcReact.queue.useQuery({ jobId: String(id) });

    useEffect(() => {
        const interval = setInterval(() => {
            data.refetch();

            if (data.data?.status === 'completed') {
                clearInterval(interval);
            }
        }, 5_000);

        return () => clearInterval(interval);
    }, [data]);

    const bgColour = useMemo(() => {
        switch (data.data?.status) {
            case 'completed':
                return 'bg-green-200';
            case 'active':
                return 'bg-blue-200';
            case 'waiting':
                return 'bg-yellow-200';
            case 'failed':
                return 'bg-red-200';
            default:
                return '';
        }
    }, [data.data?.status]);

    if (!data.data) {
        return <div>No job found! 😭</div>;
    }

    if (data.error) {
        return <div>Error: {data.error.message}</div>;
    }

    return (
        <div className={`max-w-xl mx-auto rounded border p-4 mt-32 shadow ${bgColour}`}>
            <h1 className="text-xl pb-4">{`Job Status (#${id})`}</h1>
            <p>Percent: {data.data?.progress}</p>
            <p>Status: {data.data?.status.toLocaleUpperCase()}</p>
        </div>
    );
}
