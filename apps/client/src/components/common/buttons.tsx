import { Moon, Sun, type LucideIcon } from 'lucide-react';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '../ui/index.js';
import { cn } from '@/utils/index.js';
import React, { type ComponentPropsWithoutRef } from 'react';
import { useTheme } from '@/context/index.js';

export type IconButtonProps = {
    onClick: () => void;
    icon: LucideIcon;
    tooltip: string;
    className?: string;
    variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
};

export function IconButton({
    onClick,
    className,
    tooltip,
    icon,
    variant = 'outline'
}: IconButtonProps): JSX.Element {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant={variant} onClick={onClick} size="icon" className="mb-2">
                    {React.createElement(icon, {
                        className: cn('w-4 h-4', className)
                    })}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
}

export type IconAnchorButtonProps = {
    href: string;
    icon: LucideIcon;
    tooltip: string;
    className?: string;
    variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
};

export function IconAnchorButton({
    href,
    className,
    tooltip,
    icon,
    variant = 'outline'
}: IconAnchorButtonProps): JSX.Element {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant={variant} asChild size="icon" className="mb-2">
                    <a href={href}>
                        {React.createElement(icon, {
                            className: cn('w-4 h-4', className)
                        })}
                    </a>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
}

export function LightDarkModeToggle(): JSX.Element {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
