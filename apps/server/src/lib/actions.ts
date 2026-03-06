import { prisma } from "./prisma";
import { hashPassword } from "../utils/hashing";


export const checkUser = async (username: string, isLogin: boolean) => {
    try {
        const response = await prisma.user.findFirst({ where: { username }})
        if (response?.id) {
            if (isLogin) return { exists: true, user: response };
            return { exists: true }
        }
        return { exists: false }
    } catch (error: unknown) {
        return { error: (error as Error).message }
    }
}

export const registerUser = async (username: string, pass: string) => {
    try {
        const passHash = await hashPassword(pass);
        const response = await prisma.user.create({ data: {
            username,
            passHash
        }});
        return { user: response };
    } catch (error: unknown) {
        return { error: (error as Error).message }
    }
}