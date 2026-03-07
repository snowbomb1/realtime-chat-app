import jwt from 'jsonwebtoken';

export function createToken(id: string, username: string) {
    const secret = process.env["JWT_SECRET"]
    if (!secret) throw new Error("secret key missing")
    const payload = {
        id,
        username
    };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" })
    return token;
}

export function isValidToken(token: string) {
    try {
        const secret = process.env["JWT_SECRET"]
        if (!secret) throw new Error("secret key missing")
        const data = jwt.verify(token, secret);
        return data as { id: string, username: string }
    } catch (_error) {
        return null;
    }
}