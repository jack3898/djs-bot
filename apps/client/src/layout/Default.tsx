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
                            <Button asChild variant="outline">
                                <Link to="/" className={navigationMenuTriggerStyle()}>
                                    <NavigationMenuLink>Home</NavigationMenuLink>
                                </Link>
                            </Button>
                        </NavigationMenuItem>
                        {!data?.authenticated ? (
                            <NavigationMenuItem asChild>
                                <Button asChild variant="outline">
                                    <Link to="/signup" className={navigationMenuTriggerStyle()}>
                                        <NavigationMenuLink>Sign up</NavigationMenuLink>
                                    </Link>
                                </Button>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem asChild>
                                <Button asChild variant="outline">
                                    <Link to="/me" className={navigationMenuTriggerStyle()}>
                                        <NavigationMenuLink>Me</NavigationMenuLink>
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
