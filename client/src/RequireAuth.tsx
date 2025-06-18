import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }) {
    const { email, loading } = useAuth();
    if (loading) {
        return null;
    }
    if (!email) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
