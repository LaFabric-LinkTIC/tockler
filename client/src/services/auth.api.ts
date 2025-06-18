import { REQUEST_CODE_URL, VERIFY_CODE_URL } from '../webhook.constants';

export async function requestCode(email: string): Promise<void> {
    const res = await fetch(REQUEST_CODE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        throw new Error('Request code failed');
    }
}

export async function verifyCode(email: string, code: string): Promise<void> {
    const res = await fetch(VERIFY_CODE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
        throw new Error('Invalid code');
    }
}
