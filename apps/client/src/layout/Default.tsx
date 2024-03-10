import {
    Button,
    Card,
    CardContent,
    CardHeader,
    ModeToggle,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/index.js';
import { trpcReact } from '@/trpcReact.js';
import { Link } from 'react-router-dom';
import { HomeIcon, LogInIcon, CircleUserRoundIcon } from 'lucide-react';

type DefaultLayoutProps = {
    pageTitle: React.ReactNode;
    children: React.ReactNode;
};

export function DefaultLayout({ children, pageTitle }: DefaultLayoutProps): JSX.Element {
    const { data } = trpcReact.me.useQuery();

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <div className="flex justify-between gap-1">
                <NavigationMenu>
                    <NavigationMenuList className="inline-flex gap-1">
                        <NavigationMenuItem asChild>
                            <Button asChild variant="outline" size="icon">
                                <Link to="/" className={navigationMenuTriggerStyle()}>
                                    <NavigationMenuLink>
                                        <HomeIcon className="h-4 w-4" />
                                    </NavigationMenuLink>
                                </Link>
                            </Button>
                        </NavigationMenuItem>
                        {!data?.authenticated ? (
                            <NavigationMenuItem asChild>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="inline-flex gap-2"
                                >
                                    <Link to="/signup" className={navigationMenuTriggerStyle()}>
                                        <NavigationMenuLink>
                                            <LogInIcon className="h-4 w-4" />
                                        </NavigationMenuLink>{' '}
                                        Log in / Sign up
                                    </Link>
                                </Button>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem asChild>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="inline-flex gap-2"
                                >
                                    <Link to="/me" className={navigationMenuTriggerStyle()}>
                                        <NavigationMenuLink>
                                            <CircleUserRoundIcon className="h-[1.2rem] w-[1.2rem]" />
                                        </NavigationMenuLink>{' '}
                                        Account
                                    </Link>
                                </Button>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
                <ModeToggle />
            </div>
            <Card className="mt-4">
                <CardHeader>{pageTitle}</CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
