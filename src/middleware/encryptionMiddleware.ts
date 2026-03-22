import { Request, Response, NextFunction } from "express";
import { encrypt, decrypt } from "../utils/encryption.js";

// Middleware to decrypt incoming requests and encrypt outgoing responses
export const encryptionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Decrypt incoming request body if it contains an encrypted payload
    if (req.body && req.body.payload && typeof req.body.payload === "string") {
        try {
            const decryptedString = decrypt(req.body.payload);
            const parsedBody = JSON.parse(decryptedString);
            req.body = parsedBody;
        } catch (err) {
            console.error("Failed to decrypt request body:", err);
            res.status(400).json({ error: "Invalid encrypted payload" });
            return;
        }
    }

    // 2. Intercept res.json to encrypt the outgoing response
    const originalJson = res.json;

    res.json = function (body: any) {
        // Prevent double encryption or encrypting error responses if desired.
        // For security, we encrypt all JSON responses.
        try {
            // Check if the body is already an encrypted payload object to avoid double encryption
            if (body && body.payload && typeof body.payload === "string" && Object.keys(body).length === 1) {
                return originalJson.call(this, body);
            }

            const stringifiedBody = JSON.stringify(body);
            const encryptedBody = encrypt(stringifiedBody);
            
            // Send back the encrypted payload
            return originalJson.call(this, { payload: encryptedBody });
        } catch (err) {
            console.error("Failed to encrypt response body:", err);
            // Fallback to sending standard error unencrypted to avoid infinite loops
            return originalJson.call(this, { error: "Encryption failed on server" });
        }
    };

    next();
};
