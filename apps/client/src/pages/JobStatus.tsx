import { useParams } from 'react-router-dom';
import { trpcReact } from '../trpcReact.js';

export function JobStatus(): JSX.Element {
    const { id } = useParams();
    const thing = trpcReact.queue.useQuery('hi');

    return (
        <>
            {JSON.stringify(thing)}
            <div className="bg-black text-white block">Job Status {id}</div>
        </>
    );
}
