import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { CardBox } from '../components/CardBox';
import { AuthContext } from '../AuthContext';

const allowedDomains = ['linktic.com', '3tcapital.co', 'wimbu.com'];

export function LoginPage() {
    const { requestCode, verifyCode } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [message, setMessage] = useState('');

    const validateDomain = (value: string) => {
        return allowedDomains.some((d) => value.endsWith(`@${d}`));
    };

    const sendCode = async () => {
        if (!validateDomain(email)) {
            setError('Dominio no autorizado.');
            return;
        }
        try {
            await requestCode(email);
            setMessage('Código enviado.');
            setStep('code');
            setError('');
        } catch (e) {
            setError('Error enviando código');
        }
    };

    const submitCode = async () => {
        try {
            await verifyCode(email, code);
        } catch (e) {
            setError('Código inválido');
            return;
        }
    };

    return (
        <Flex p={4} justifyContent="center" alignItems="center" h="100vh">
            <CardBox width={['100%', '400px']}>
                <VStack spacing={3} alignItems="stretch">
                    {step === 'email' && (
                        <>
                            <Input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Button onClick={sendCode}>Enviar</Button>
                        </>
                    )}
                    {step === 'code' && (
                        <>
                            <Input placeholder="Código" value={code} onChange={(e) => setCode(e.target.value)} />
                            <Button onClick={submitCode}>Validar</Button>
                        </>
                    )}
                    {message && <Text color="green">{message}</Text>}
                    {error && <Text color="red">{error}</Text>}
                </VStack>
            </CardBox>
        </Flex>
    );
}
