import {
    Button,
    Card,
    H3,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { cn } from '@/utils/cn.js';
import { ArrowDownToLine, CheckIcon, RefreshCw, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

function DownloadFileButton({ url }: { url: string }): JSX.Element {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                    <a href={url}>
                        <ArrowDownToLine className="w-4 h-4" />
                    </a>
                </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
        </Tooltip>
    );
}

function DeleteFileButton({ id }: { id: string }): JSX.Element {
    const [deleted, setDeleted] = useState(false);
    const { mutate } = trpcReact.deleteFile.useMutation({
        onMutate: async () => {
            setDeleted(true);
        }
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={() => mutate(id)}>
                    {deleted ? (
                        <CheckIcon className="w-4 h-4" />
                    ) : (
                        <Trash2Icon className="w-4 h-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Permanently delete</TooltipContent>
        </Tooltip>
    );
}

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

export function UserDownloads(): JSX.Element {
    const { data, isLoading, refetch, isFetching } = trpcReact.userFiles.useQuery();

    if (isLoading || isFetching) {
        return (
            <>
                <div className="flex gap-2 justify-between">
                    <H3 className="mb-4">Your Files</H3>
                    <RefreshFileListButton onClick={refetch} spin={isFetching} />
                </div>
                <em>Please wait...</em>
            </>
        );
    }

    if (!data?.length) {
        return (
            <>
                <div className="flex gap-2 justify-between">
                    <H3 className="mb-4">Your Files</H3>
                    <RefreshFileListButton onClick={refetch} spin={isFetching} />
                </div>
                <em>No files found.</em>
            </>
        );
    }

    return (
        <>
            <div className="flex gap-2 justify-between">
                <H3 className="mb-4">Your Files</H3>
                <RefreshFileListButton onClick={refetch} spin={isFetching} />
            </div>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-full">Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((file) => {
                            return (
                                <TableRow key={file.id}>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>{file.size}</TableCell>
                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(file.createdAt)) +
                                                        ' ago'}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {new Date(file.createdAt).toLocaleString()}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <DownloadFileButton url={file.url} />
                                        <DeleteFileButton id={file.id} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
