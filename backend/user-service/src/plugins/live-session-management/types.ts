import type { UserId } from './state';

// Message from SPA
export interface StatusMessage {
	userId: UserId;
	status: 'online' | 'offline';
}
