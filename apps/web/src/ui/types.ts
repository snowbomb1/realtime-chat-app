export interface Message {
    id: string;
    username: string;
    message: string;
    timestamp: string;
    type: 'user' | 'system'
    avatarColor: string;
}

