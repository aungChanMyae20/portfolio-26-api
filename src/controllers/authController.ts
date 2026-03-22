import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { AuthRequest } from "../middleware/auth.js";


// POST /api/auth/login
export const login = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token,
        });
    } catch {
        res.status(500).json({ error: "Login failed" });
    }
};

// GET /api/auth/me
export const getMe = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json({ user });
    } catch {
        res.status(500).json({ error: "Failed to get user" });
    }
};

// PUT /api/auth/update
export const updateCredentials = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!currentPassword) {
            res.status(400).json({ error: "Current password is required" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }

        const updateData: { email?: string; password?: string } = {};

        if (email && email !== user.email) {
            // Check if new email is taken
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: "Email already in use" });
                return;
            }
            updateData.email = email;
        }

        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "No changes requested" });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: updateData,
            select: { id: true, email: true, name: true },
        });

        res.json({ user: updatedUser, message: "Credentials updated successfully" });
    } catch (error) {
        console.error("Update credentials error:", error);
        res.status(500).json({ error: "Failed to update credentials" });
    }
};
