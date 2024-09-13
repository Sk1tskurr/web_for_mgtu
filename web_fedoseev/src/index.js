import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/login';
import MainPage from './pages/main';
import Apocalypse from './pages/apocalypse';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/apocalypse',
        element: <Apocalypse />,
    },
    {
        path: '/main',
        element: <MainPage />,
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

reportWebVitals();
