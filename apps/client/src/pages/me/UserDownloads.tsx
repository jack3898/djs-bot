import {
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
import { ArrowDownToLine, CheckIcon, RefreshCw, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IconAnchorButton, IconButton } from '@/components/common/index.js';

function DownloadFileButton({ url }: { url: string }): JSX.Element {
    return <IconAnchorButton href={url} icon={ArrowDownToLine} tooltip="Download" />;
}

function DeleteFileButton({ id }: { id: string }): JSX.Element {
    const [deleted, setDeleted] = useState(false);
    const { mutate } = trpcReact.deleteFile.useMutation({
        onMutate: () => setDeleted(true)
    });

    return (
        <IconButton
            onClick={() => mutate(id)}
            variant="destructive"
            icon={deleted ? CheckIcon : Trash2Icon}
            tooltip="Permanently delete"
        />
    );
}

export function UserDownloadsLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const { refetch, isFetching } = trpcReact.userFiles.useQuery();

    return (
        <>
            <div className="flex gap-2 justify-between">
                <H3 className="mb-4">Your Files</H3>
                <IconButton
                    onClick={refetch}
                    icon={RefreshCw}
                    tooltip="Refresh file list"
                    className={isFetching ? 'animate-spin' : ''}
                />
            </div>
            {children}
        </>
    );
}

export function UserDownloads(): JSX.Element {
    const { data, isLoading } = trpcReact.userFiles.useQuery();

    if (isLoading) {
        return (
            <UserDownloadsLayout>
                <em>Please wait...</em>
            </UserDownloadsLayout>
        );
    }

    if (!data?.length) {
        return (
            <UserDownloadsLayout>
                <em>No files found.</em>
            </UserDownloadsLayout>
        );
    }

    return (
        <UserDownloadsLayout>
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
        </UserDownloadsLayout>
    );
}
