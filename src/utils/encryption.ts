import crypto from "crypto";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-cbc";

// The key is stored as a 64-character hex string in the environment variable.
// We need to parse it into a 32-byte Buffer.
const getEncryptionKey = (): Buffer => {
    if (!env.ENCRYPTION_KEY || env.ENCRYPTION_KEY.length !== 64) {
        throw new Error("ENCRYPTION_KEY must be a 64-character hex string.");
    }
    return Buffer.from(env.ENCRYPTION_KEY, "hex");
};

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    // Return the IV and the encrypted data separated by a colon
    return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedData: string): string => {
    const [ivHex, cipherTextHex] = encryptedData.split(":");
    
    if (!ivHex || !cipherTextHex) {
        throw new Error("Invalid encrypted data format");
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(cipherTextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
};
