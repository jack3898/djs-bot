import {
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { ArrowDownToLine } from 'lucide-react';

export function UserDownloads(): JSX.Element {
    const { data, isLoading } = trpcReact.userFiles.useQuery();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!data?.length) {
        return <em>No files found.</em>;
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" asChild>
                                                <a href={file.url}>
                                                    <ArrowDownToLine className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
