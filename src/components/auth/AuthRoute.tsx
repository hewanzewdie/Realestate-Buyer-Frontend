import { Navigate } from 'react-router-dom';

export default function AuthRoute({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}