export const URL = "http://localhost:3000"

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