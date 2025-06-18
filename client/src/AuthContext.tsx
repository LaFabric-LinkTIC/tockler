import { createContext, useContext, useEffect, useState } from 'react';
import { ElectronEventEmitter } from './services/ElectronEventEmitter';

interface AuthContextType {
    email: string | null;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    email: null,
    login: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }) {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        ElectronEventEmitter.emit<string | null>('getUserEmail').then((e) => {
            if (e) setEmail(e);
        });
    }, []);

    const login = async (newEmail: string) => {
        await ElectronEventEmitter.emit('setUserEmail', { email: newEmail });
        setEmail(newEmail);
    };

    const logout = async () => {
        await ElectronEventEmitter.emit('clearUserEmail');
        setEmail(null);
    };

    return <AuthContext.Provider value={{ email, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
