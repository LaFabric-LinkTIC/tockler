import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }) {
    const { email } = useAuth();
    if (!email) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
