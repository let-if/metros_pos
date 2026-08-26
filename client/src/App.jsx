// client/src/App.jsx
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </>
  );
}