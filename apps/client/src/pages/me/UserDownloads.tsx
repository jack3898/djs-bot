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
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { cn } from '@/utils/cn.js';
import { ArrowDownToLine, CheckIcon, RefreshCw, Trash2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';

function DownloadFileButton({ url }: { url: string }): JSX.Element {
    return (
        <TooltipProvider>
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
        </TooltipProvider>
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
        <TooltipProvider>
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
        </TooltipProvider>
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
        <Button onClick={onClick} size="icon" variant="outline" className="mb-2">
            <RefreshCw className={cn(`w-4 h-f ${spin ? 'animate-spin' : ''}`)} />
        </Button>
    );
}

export function UserDownloads(): JSX.Element {
    const { data, isLoading, refetch, isFetching } = trpcReact.userFiles.useQuery();

    const refresh = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading || isFetching) {
        return (
            <>
                <div className="flex gap-2 justify-between">
                    <H3 className="mb-4">Your Files</H3>
                    <RefreshFileListButton onClick={refresh} spin={isFetching} />
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
                    <RefreshFileListButton onClick={refresh} spin={isFetching} />
                </div>
                <em>No files found.</em>
            </>
        );
    }

    return (
        <>
            <div className="flex gap-2 justify-between">
                <H3 className="mb-4">Your Files</H3>
                <RefreshFileListButton onClick={refresh} spin={isFetching} />
            </div>
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
                        {data?.map((file) => {
                            return (
                                <TableRow key={file.id}>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>{file.size}</TableCell>
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
