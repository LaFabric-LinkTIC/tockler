import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';
import * as authApi from '../services/auth.api';

const requestCode = vi.spyOn(authApi, 'requestCode');
const verifyCode = vi.spyOn(authApi, 'verifyCode');
const navigateMock = vi.fn();
const loginMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual<typeof import('react-router-dom')>('react-router-dom'));
    return { ...actual, useNavigate: () => navigateMock };
});
vi.mock('../AuthContext', () => ({
    useAuth: () => ({ email: null, login: loginMock, logout: vi.fn() }),
}));

const renderPage = () => render(<LoginPage />);

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('rejects unauthorized email domains', async () => {
        renderPage();
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'user@gmail.com' } });
        fireEvent.click(screen.getByText('Enviar'));
        expect(await screen.findByText('Dominio no autorizado.')).toBeInTheDocument();
        expect(requestCode).not.toHaveBeenCalled();
    });

    it('requests code for valid email', async () => {
        requestCode.mockResolvedValue();
        renderPage();
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'user@linktic.com' } });
        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => expect(requestCode).toHaveBeenCalledWith('user@linktic.com'));
        expect(await screen.findByText('Código enviado.')).toBeInTheDocument();
        expect(screen.getByText('Validar')).toBeInTheDocument();
    });

    it('verifies code and logs in', async () => {
        requestCode.mockResolvedValue();
        verifyCode.mockResolvedValue();
        renderPage();
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'user@linktic.com' } });
        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => expect(requestCode).toHaveBeenCalled());
        fireEvent.change(screen.getByPlaceholderText('Código'), { target: { value: '123' } });
        fireEvent.click(screen.getByText('Validar'));
        await waitFor(() => expect(verifyCode).toHaveBeenCalledWith('user@linktic.com', '123'));
        expect(loginMock).toHaveBeenCalledWith('user@linktic.com');
        expect(navigateMock).toHaveBeenCalledWith('/app');
    });
});
