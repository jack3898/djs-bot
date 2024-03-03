import { useParams } from 'react-router-dom';

export function JobStatus(): JSX.Element {
    const { id } = useParams();

    return <div className="bg-black text-white block">Job Status {id}</div>;
}
