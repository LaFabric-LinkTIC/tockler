import { createContext, useContext, useEffect, useState } from 'react';
import { ElectronEventEmitter } from './services/ElectronEventEmitter';

interface AuthContextType {
    email: string | null;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    email: null,
    login: async () => {},
    logout: async () => {},
    loading: true,
});

export function AuthProvider({ children }) {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ElectronEventEmitter.emit<string | null>('getUserEmail')
            .then((e) => {
                const stored = e ?? localStorage.getItem('userEmail');
                if (stored) setEmail(stored);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (newEmail: string) => {
        await ElectronEventEmitter.emit('setUserEmail', { email: newEmail });
        localStorage.setItem('userEmail', newEmail);
        setEmail(newEmail);
    };

    const logout = async () => {
        await ElectronEventEmitter.emit('clearUserEmail');
        localStorage.removeItem('userEmail');
        setEmail(null);
    };

    return <AuthContext.Provider value={{ email, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
