import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

type RequireAuthProps = {
  allowedRoles: string[];
};

const RequireNoAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const { roles } = useAuth();

  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );

  return content;
};

export default RequireNoAuth;
