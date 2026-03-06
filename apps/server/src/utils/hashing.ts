import bcrpyt from 'bcrypt';


export async function hashPassword(pass: string) {
    return bcrpyt.hash(pass, 10);
}

export async function isMatchingHash(pass: string, serverHash: string) {
    return bcrpyt.compare(pass, serverHash)
}