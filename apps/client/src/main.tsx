import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App, JobStatus } from './pages/index.js';
import { StrictMode } from 'react';
import { TrpcProvider, ThemeProvider } from './context/index.js';

const root = document.getElementById('root');

const router = createBrowserRouter([
    {
        path: '/*',
        element: <App />
    },
    {
        path: '/jobs/:id',
        element: <JobStatus />
    }
]);

if (root !== null) {
    createRoot(root).render(
        <StrictMode>
            <ThemeProvider>
                <TrpcProvider>
                    <RouterProvider router={router} />
                </TrpcProvider>
            </ThemeProvider>
        </StrictMode>
    );
}
