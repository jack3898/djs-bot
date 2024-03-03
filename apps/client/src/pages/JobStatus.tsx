import { useParams } from 'react-router-dom';

export function JobStatus(): JSX.Element {
    const { id } = useParams();

    return <div>Job Status {id}</div>;
}
