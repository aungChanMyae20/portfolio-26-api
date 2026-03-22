import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import { prisma } from "./lib/prisma.js";

const app = express();

import { encryptionMiddleware } from "./middleware/encryptionMiddleware.js";

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(encryptionMiddleware);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", portfolioRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, async () => {
    console.log(`\n🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📊 Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`🌱 Environment: ${env.NODE_ENV}\n`);
    
    try {
        // Explicitly test the database connection
        await prisma.$connect();
        console.log(`✅ Database connected successfully!`);
    } catch (error) {
        console.error(`❌ Database connection failed:`, error);
        // We can choose not to exit here if we want the server to stay alive even if DB is down initially
    }
});

export default app;
