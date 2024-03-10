import {
    Button,
    Card,
    H1,
    H3,
    Separator,
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
import { DefaultLayout } from '@/layout/Default.js';
import { trpcReact } from '@/trpcReact.js';
import { ArrowDownToLine } from 'lucide-react';

export function Me(): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    if (!data?.authenticated) {
        return (
            <DefaultLayout pageTitle="Not logged in">
                <p>You are not logged in.</p>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout pageTitle={<H1>Your Account</H1>}>
            <p>
                You are currently logged in as <strong>{data?.username}</strong>!
            </p>
            <Separator className="my-4" />
            <H3 className="mb-4">Your Files</H3>
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
                        <TableRow>
                            <TableCell>test1.txt</TableCell>
                            <TableCell>1.8MB</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <ArrowDownToLine className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>test2.txt</TableCell>
                            <TableCell>1.9MB</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <ArrowDownToLine className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
            <Separator className="my-4" />
            <Button asChild>
                <a href="/auth/discord/logout">Logout</a>
            </Button>
        </DefaultLayout>
    );
}
