import { useColorMode } from '@chakra-ui/react';
import { StoreProvider } from 'easy-peasy';
import { Settings } from 'luxon';
import { useCallback, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { TrayLayout } from './components/TrayLayout/TrayLayout';
import { Logger } from './logger';
import { RootProvider } from './RootContext';
import { AuthProvider, AuthContext } from './AuthContext';
import { ChartThemeProvider } from './routes/ChartThemeProvider';
import { MainAppPage } from './routes/MainAppPage';
import { LoginPage } from './routes/LoginPage';
import { NotificationAppPage } from './routes/NotificationAppPage';
import { TrayAppPage } from './routes/TrayAppPage';
import { ElectronEventEmitter } from './services/ElectronEventEmitter';
import { mainStore } from './store/mainStore';
import { useGoogleAnalytics } from './useGoogleAnalytics';

Settings.defaultLocale = 'en-GB';

export function MainRouter() {
    useGoogleAnalytics();
    const { setColorMode } = useColorMode();

    const changeActiveTheme = useCallback(
        (themeName) => {
            setColorMode(themeName);
        },
        [setColorMode],
    );

    useEffect(() => {
        ElectronEventEmitter.on('activeThemeChanged', changeActiveTheme);

        return () => {
            Logger.debug('Clearing eventEmitter');
            ElectronEventEmitter.off('activeThemeChanged', changeActiveTheme);
        };
    }, [changeActiveTheme]);

    return (
        <AuthProvider>
            <ChartThemeProvider>
                <RootProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        {/* Main App with main store */}
                        <Route
                            path="/app/*"
                            element={
                                <AuthContext.Consumer>
                                    {({ email }) =>
                                        email ? (
                                            <StoreProvider store={mainStore}>
                                                <MainAppPage />
                                            </StoreProvider>
                                        ) : (
                                            <Navigate to="/login" replace />
                                        )
                                    }
                                </AuthContext.Consumer>
                            }
                        />

                        {/* Redirect from root to /app */}
                        <Route
                            path="/"
                            element={
                                <AuthContext.Consumer>
                                    {({ email }) => <Navigate to={email ? '/app' : '/login'} replace />}
                                </AuthContext.Consumer>
                            }
                        />

                        {/* Tray App - No longer needs trayStore */}
                        <Route
                            path="/trayApp"
                            element={
                                <TrayLayout>
                                    <ErrorBoundary>
                                        <TrayAppPage />
                                    </ErrorBoundary>
                                </TrayLayout>
                            }
                        />

                        <Route path="/notificationApp" element={<NotificationAppPage />} />

                        {/* Fallback redirect */}
                        <Route
                            path="*"
                            element={
                                <AuthContext.Consumer>
                                    {({ email }) => <Navigate to={email ? '/app' : '/login'} replace />}
                                </AuthContext.Consumer>
                            }
                        />
                    </Routes>
                </RootProvider>
            </ChartThemeProvider>
        </AuthProvider>
    );
}
