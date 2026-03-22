import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || "4000", 10),
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-me",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,
} as const;
