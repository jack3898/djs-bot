import { IconButton } from '@/components/common/index.js';
import { Button, H3 } from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { CheckIcon, RefreshCw, XIcon, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

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

function UserJobsLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const { isFetching, refetch } = trpcReact.jobs.useQuery();

    return (
        <>
            <div className="flex gap-2 justify-between">
                <H3 className="mb-4">Your Files</H3>
                <IconButton
                    onClick={refetch}
                    icon={RefreshCw}
                    tooltip="Refresh job list"
                    className={isFetching ? 'animate-spin' : ''}
                />
            </div>
            {children}
        </>
    );
}

export function UserJobs(): JSX.Element {
    const { data, isLoading } = trpcReact.jobs.useQuery();

    if (isLoading) {
        return (
            <UserJobsLayout>
                <em>Please wait...</em>
            </UserJobsLayout>
        );
    }

    if (!data?.length) {
        return (
            <UserJobsLayout>
                <em>No jobs found.</em>
            </UserJobsLayout>
        );
    }

    return (
        <UserJobsLayout>
            <ul className="flex flex-wrap gap-2 mb-4">
                {data?.map((job) => (
                    <li key={job.id}>
                        <JobCard jobId={job.jobId} status={job.status} />
                    </li>
                ))}
            </ul>
        </UserJobsLayout>
    );
}
