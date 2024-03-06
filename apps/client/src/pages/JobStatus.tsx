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

    const borderColour = useMemo(() => {
        switch (data.data?.status) {
            case 'completed':
                return 'border-emerald-200';
            case 'active':
                return 'border-blue-200';
            case 'waiting':
                return 'border-yellow-200';
            case 'failed':
                return 'border-red-200';
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
        <div className="h-screen flex justify-center items-center bg-slate-100">
            <div
                className={`min-w-[32rem] text-center rounded border-4 p-4 shadow-xl ${borderColour} bg-white`}
            >
                <h1 className="text-xl pb-4">{`Job Status (#${id})`}</h1>
                <p>Render percent: {data.data?.progress}</p>
                <p>Status: {data.data?.status.toLocaleUpperCase()}</p>
            </div>
        </div>
    );
}
