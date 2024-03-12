import { Button, H3, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { cn } from '@/utils/cn.js';
import { CheckIcon, RefreshCw, XIcon, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

function RefreshFileListButton({
    onClick,
    spin
}: {
    onClick: () => void;
    spin: boolean;
}): JSX.Element {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={onClick} size="icon" variant="outline" className="mb-2">
                    <RefreshCw className={cn(`w-4 h-f ${spin ? 'animate-spin' : ''}`)} />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh file list</TooltipContent>
        </Tooltip>
    );
}

function JobCard({ jobId: id, status }: { jobId: number; status: string }): JSX.Element {
    const iconComponent = useMemo(() => {
        switch (status) {
            case 'active':
                return <RefreshCw className="w-4 h-4 animate-spin" />;
            case 'completed':
                return <CheckIcon className="w-4 h-4" />;
            case 'failed':
                return <XIcon className="w-4 h-4" />;
            case 'waiting':
                return <Clock className="w-4 h-4" />;
            default:
                return null;
        }
    }, [status]);

    return (
        <Button variant="outline" asChild>
            <Link to={`/jobs/${id}`}>
                <span className="inline-block mr-2">{iconComponent}</span>
                <strong>#{id}</strong>
            </Link>
        </Button>
    );
}

export function UserJobs(): JSX.Element {
    const { data, isLoading, isFetching, refetch } = trpcReact.jobs.useQuery();

    if (isLoading || isFetching) {
        return (
            <div className="mb-4">
                <div className="flex gap-2 justify-between">
                    <H3 className="mb-4">Your Jobs</H3>
                    <RefreshFileListButton onClick={refetch} spin={isFetching} />
                </div>
                <em>Please wait...</em>
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-2 justify-between">
                <H3 className="mb-4">Your Jobs</H3>
                <RefreshFileListButton onClick={refetch} spin={isFetching} />
            </div>
            <ul className="flex flex-wrap gap-2 mb-4">
                {data?.map((job) => (
                    <li key={job.id}>
                        <JobCard jobId={job.jobId} status={job.status} />
                    </li>
                ))}
            </ul>
        </>
    );
}
