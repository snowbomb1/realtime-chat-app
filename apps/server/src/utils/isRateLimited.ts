interface RateLimitProps {
    socketId: string;
    messageTimestamps: Map<string, number[]>;
}

const LIMIT = 10;
const WINDOWMS = 5000;

export function isRateLimited({ socketId, messageTimestamps }: RateLimitProps): boolean {
    const now = Date.now();
    const timestamps = messageTimestamps.get(socketId) ?? [];
    const recent = timestamps.filter(t => now - t < WINDOWMS);
    messageTimestamps.set(socketId, recent);
    if (recent.length >= LIMIT) return true;
    messageTimestamps.set(socketId, [...recent, now]);
    return false;
}