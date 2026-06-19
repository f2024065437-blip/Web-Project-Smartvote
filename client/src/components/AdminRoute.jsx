import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;