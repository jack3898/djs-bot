import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Jobs, NotFound, Home, Signup, Me } from './pages/index.js';
import { StrictMode } from 'react';
import { TrpcProvider, ThemeProvider } from './context/index.js';
import { TooltipProvider } from './components/ui/index.js';

const root = document.getElementById('root');

const router = createBrowserRouter([
    {
        path: '/*',
        element: <NotFound />
    },
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/me',
        element: <Me />
    },
    {
        path: '/jobs/:id',
        element: <Jobs />
    }
]);

if (root !== null) {
    createRoot(root).render(
        <StrictMode>
            <TooltipProvider>
                <ThemeProvider>
                    <TrpcProvider>
                        <RouterProvider router={router} />
                    </TrpcProvider>
                </ThemeProvider>
            </TooltipProvider>
        </StrictMode>
    );
}
