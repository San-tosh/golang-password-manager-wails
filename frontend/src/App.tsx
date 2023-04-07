import './App.css'
import {Routes, Route, Navigate, BrowserRouter} from "react-router-dom";
import Auth from './layouts/auth/index';
import AdminLayout from './layouts/admin/index';
import { useSelector } from "react-redux";
import PageNotFound from './views/PageNotFound';

function App() {
  const { currentUser } = useSelector((state: any) => state.user);
    return (
      <>
        <BrowserRouter>
        <Routes>
          <Route path="auth/*" element={<Auth />} />
          
          {currentUser && (
            <>
            <Route path="admin/*" element={<AdminLayout />} />
            </>
          )}
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </BrowserRouter>
        </>
      );
}

export default App
