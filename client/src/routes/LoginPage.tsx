import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { requestCode, verifyCode } from '../services/auth.api';

const allowedDomains = ['linktic.com', '3tcapital.co', 'wimbu.com'];

const isValidDomain = (email: string) => {
    const parts = email.split('@');
    return parts.length === 2 && allowedDomains.includes(parts[1]);
};

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [message, setMessage] = useState('');

    const sendEmail = async () => {
        if (!isValidDomain(email)) {
            setMessage('Dominio no autorizado.');
            return;
        }
        try {
            await requestCode(email);
            setMessage('Código enviado.');
            setStep('code');
        } catch (e) {
            setMessage('Error al solicitar código.');
        }
    };

    const validate = async () => {
        try {
            await verifyCode(email, code);
            await login(email);
            navigate('/app');
        } catch {
            setMessage('Código inválido.');
        }
    };

    return (
        <Box p={4} maxW="sm" mx="auto">
            {step === 'email' && (
                <VStack spacing={3} alignItems="flex-start">
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
                    <Button onClick={sendEmail}>Enviar</Button>
                    {message && <Text color="red.500">{message}</Text>}
                </VStack>
            )}
            {step === 'code' && (
                <VStack spacing={3} alignItems="flex-start">
                    <Text>{email}</Text>
                    <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código" />
                    <Button onClick={validate}>Validar</Button>
                    {message && <Text color="red.500">{message}</Text>}
                </VStack>
            )}
        </Box>
    );
}
