export const URL = import.meta.env.DEV
    ? "http://localhost:3000" 
    : "https://realtime-chat-app-still-lake-5338.fly.dev"

export interface AuthOutput {
    id: string;
    username: string;
    token: string;
}

export const login = async (username: string, password: string) => {
    try {
        const response = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const data = await response.json();
            return { error: data.error };
        }
        const data = await response.json();
        return data as AuthOutput;
    } catch (error) {
        return { error: "Database call failed"}
    }
}


export const register = async (username: string, password: string) => {
    try {
        const response = await fetch(`${URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const data = await response.json();
            return { error: data.error };
        }
        const data = await response.json();
        return data as AuthOutput;
    } catch (_error) {
        return { error: "Database call failed"}
    }
}