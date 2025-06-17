import { createContext, useCallback, useEffect, useState } from 'react';
import { requestCode as apiRequestCode, verifyCode as apiVerifyCode } from './services/auth.api';

type AuthContextType = {
    email: string | null;
    requestCode: (email: string) => Promise<void>;
    verifyCode: (email: string, code: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    email: null,
    requestCode: async () => {},
    verifyCode: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string | null>(() => localStorage.getItem('userEmail'));

    useEffect(() => {
        if (email) {
            window.electronBridge
                ?.invokeIpc('getMacAddress')
                .then((mac) => window.electronBridge?.invokeIpc('setAuthInfo', { email, macAddress: mac }));
        }
    }, [email]);

    const requestCode = useCallback(async (e: string) => {
        await apiRequestCode(e);
    }, []);

    const verifyCode = useCallback(async (e: string, c: string) => {
        await apiVerifyCode(e, c);
        setEmail(e);
        localStorage.setItem('userEmail', e);
        const mac = await window.electronBridge?.invokeIpc('getMacAddress');
        await window.electronBridge?.invokeIpc('setAuthInfo', { email: e, macAddress: mac });
    }, []);

    const logout = useCallback(() => {
        setEmail(null);
        localStorage.removeItem('userEmail');
        window.electronBridge?.invokeIpc('setAuthInfo', { email: '', macAddress: '' });
    }, []);

    return <AuthContext.Provider value={{ email, requestCode, verifyCode, logout }}>{children}</AuthContext.Provider>;
};
