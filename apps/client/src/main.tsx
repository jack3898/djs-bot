import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App, JobStatus } from './pages/index.js';
import { StrictMode } from 'react';

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
            <RouterProvider router={router} />
        </StrictMode>
    );
}
