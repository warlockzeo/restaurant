import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Staff from '@/pages/Home/Staff';

import NotFound from '@/pages/NotFound/NotFound';
import Unauthorized from '@/pages/Unauthorized/Unauthorized';
import Mesas from '@/pages/Mesas/Mesas';
import Pedido from '@/pages/Pedido/Pedido';
import App from '@/App';

import Loader from '@/components/Loader/Loader';
import RootLayout from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <App /> },
      { path: '/staff', element: <Staff /> },
      { path: '/mesas/:idStaff', element: <Mesas /> },
      { path: '/pedido', element: <Pedido /> },
      { path: '/pedido/:idStaff/:idMesa', element: <Pedido /> },
    ],
  },

  { path: '/403', element: <Unauthorized /> },
]);

function Router() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </>
  );
}

export default Router;
