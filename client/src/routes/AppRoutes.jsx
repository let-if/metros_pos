
// import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
// import LoginPage from '../pages/auth/LoginPage';
// import DashboardLayout from '../components/layout/DashboardLayout';
// import DailyOverviewPage from '../pages/overview/DailyOverviewPage';
// import PosPage from '../pages/pos/PosPage';
// import ProductsPage from '../pages/inventory/ProductsPage';
// import CreditPage from '../pages/credit/CreditPage';
// import ReportsPage from '../pages/reports/ReportsPage';
// import ShiftPage from '../pages/shift/ShiftPage';
// import SettingsPage from '../pages/settings/SettingsPage';
// import CustomersPage from '../pages/customers/CustomersPage';

// // Inside your router routes:

// // Inside children:

// // Inside your children array:

// // Protected Route Guard Component
// function ProtectedRoute() {
//   const isAuthenticated = !!localStorage.getItem('meret_token');
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// }

// const router = createBrowserRouter([
//   {
//     path: '/login',
//     element: <LoginPage />,
//   },
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         element: <DashboardLayout />,
//         children: [
//           { path: '/', element: <DailyOverviewPage /> }, // 👈 Connected to your role-based Daily Overview
//           { path: '/pos', element: <PosPage /> },
//           { path: '/inventory', element: <ProductsPage /> },
//           { path: '/credit', element: <CreditPage /> },
//           { path: '/reports', element: <ReportsPage /> },
//           { path: '/overview', element: <DailyOverviewPage /> },
//           { path: '/shift', element: <ShiftPage /> },
//           { path: '/settings', element: <SettingsPage /> },
//           { path: '/customers', element: <CustomersPage /> }, // Alias route if accessed directly
//         ],
//       },
//     ],
//   },
//   {
//     path: '*',
//     element: <Navigate to="/" replace />,
//   },
// ]);

// export default function AppRoutes() {
//   return <RouterProvider router={router} />;
// }
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import LandingPage from '../pages/LandingPage'; // 👈 Import the new public landing page
import DashboardLayout from '../components/layout/DashboardLayout';
import DailyOverviewPage from '../pages/overview/DailyOverviewPage';
import PosPage from '../pages/pos/PosPage';
import ProductsPage from '../pages/inventory/ProductsPage';
import CreditPage from '../pages/credit/CreditPage';
import ReportsPage from '../pages/reports/ReportsPage';
import ShiftPage from '../pages/shift/ShiftPage';
import SettingsPage from '../pages/settings/SettingsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import TransfersPage from '../pages/inventory/TransfersPage';
// Protected Route Guard Component
function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('meret_token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />, // 👈 Public commercial marketing home page
  },
  {
    path: '/login',
    element: <LoginPage />, // 👈 Secure login workspace
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/app', element: <DailyOverviewPage /> }, // 👈 Main dashboard overview
          { path: '/pos', element: <PosPage /> },
          { path: '/inventory', element: <ProductsPage /> },
          { path: '/credit', element: <CreditPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/overview', element: <DailyOverviewPage /> },
          { path: '/shift', element: <ShiftPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/customers', element: <CustomersPage /> },
          { path:"/transfers", element:<TransfersPage />},
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}