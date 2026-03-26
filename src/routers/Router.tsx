import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@/App';
import Loader from '@/components/Loader/Loader';
import RootLayout from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>Página não encontrada</div>,
    children: [{ index: true, element: <App /> }],
  },
]);

function Router() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </>
  );
}

export default Router;
