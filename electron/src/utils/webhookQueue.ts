import Store from 'electron-store';
import { logManager } from './log-manager';

interface AuthInfo {
    email: string;
    macAddress: string;
}

let authInfo: AuthInfo | null = null;

export function setAuthInfo(info: AuthInfo) {
    authInfo = info.email ? info : null;
}

export interface WebhookEvent {
    id: number;
    payload: any;
    attempts: number;
    nextAttempt: number;
}

const WEBHOOK_URL = 'https://auto.linktic.com/webhook/tockler/log-activity';
const BASE_BACKOFF_MS = 60 * 1000; // 1 minute
const MAX_BACKOFF_MS = 60 * 60 * 1000; // 1 hour

class WebhookQueue {
    private store = new Store<{ queue: WebhookEvent[]; sent: number }>({ name: 'webhook-queue' });
    private queue: WebhookEvent[] = this.store.get('queue', []);
    private sent = this.store.get('sent', 0);
    private timer: NodeJS.Timeout | null = null;
    private logger = logManager.getLogger('WebhookQueue');

    add(payload: any) {
        if (!authInfo) {
            this.logger.debug('Skipping log, user not authenticated');
            return;
        }
        const enriched = { ...payload, email: authInfo.email, mac_address: authInfo.macAddress };
        const id = Date.now();
        this.queue.push({ id, payload: enriched, attempts: 0, nextAttempt: Date.now() });
        this.save();
    }

    stats() {
        return { pending: this.queue.length, sent: this.sent };
    }

    start(intervalMinutes: number) {
        if (this.timer) return;
        const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;
        this.timer = setInterval(() => this.process(), intervalMs);
        this.process().catch((e) => this.logger.error('process error', e));
    }

    private async process() {
        for (const event of [...this.queue]) {
            if (event.nextAttempt > Date.now()) continue;
            try {
                const res = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(event.payload),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                this.queue = this.queue.filter((e) => e.id !== event.id);
                this.sent++;
            } catch (e) {
                event.attempts++;
                const delay = Math.min(2 ** event.attempts * BASE_BACKOFF_MS, MAX_BACKOFF_MS);
                event.nextAttempt = Date.now() + delay;
                this.logger.warn('Send failed, will retry', e);
            }
        }
        this.save();
    }

    private save() {
        this.store.set('queue', this.queue);
        this.store.set('sent', this.sent);
    }
}

export const webhookQueue = new WebhookQueue();
export { WEBHOOK_URL, setAuthInfo };
