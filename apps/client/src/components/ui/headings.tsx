import { cn } from '@/utils/index.js';
import { type ComponentPropsWithoutRef } from 'react';

type H1Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h1'>;

type H2Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h2'>;

type H3Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h3'>;

type H4Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h4'>;

type H5Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h5'>;

type H6Props = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<'h6'>;

export function H1({ children, className, ...rest }: H1Props): JSX.Element {
    return (
        <h1 className={cn('text-3xl font-bold', className)} {...rest}>
            {children}
        </h1>
    );
}

export function H2({ children, className, ...rest }: H2Props): JSX.Element {
    return (
        <h2 className={cn('text-2xl font-bold', className)} {...rest}>
            {children}
        </h2>
    );
}

export function H3({ children, className, ...rest }: H3Props): JSX.Element {
    return (
        <h2 className={cn('text-xl font-bold', className)} {...rest}>
            {children}
        </h2>
    );
}

export function H4({ children, className, ...rest }: H4Props): JSX.Element {
    return (
        <h2 className={cn('text-lg font-bold', className)} {...rest}>
            {children}
        </h2>
    );
}

export function H5({ children, className, ...rest }: H5Props): JSX.Element {
    return (
        <h2 className={cn('text-base font-bold', className)} {...rest}>
            {children}
        </h2>
    );
}

export function H6({ children, className, ...rest }: H6Props): JSX.Element {
    return (
        <h2 className={cn('text-sm font-bold', className)} {...rest}>
            {children}
        </h2>
    );
}
