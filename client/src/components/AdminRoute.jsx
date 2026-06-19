import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - Role:', user?.role);
  
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  
  if (user?.role === 'admin') {
    return <Outlet />;
  }
  
  return <Navigate to="/" />;
};

export default AdminRoute;