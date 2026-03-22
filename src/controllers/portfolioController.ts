import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// ==================== PROFILE ====================

// GET /api/profile
export const getProfile = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const profile = await prisma.profile.findFirst();
        res.json({ profile });
    } catch {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// PUT /api/admin/profile
export const updateProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { fullName, title, bio, avatarUrl, resumeUrl, githubUrl, linkedinUrl, email } = req.body;

        // Upsert: create if not exists, update if exists
        const existing = await prisma.profile.findFirst();

        let profile;
        if (existing) {
            profile = await prisma.profile.update({
                where: { id: existing.id },
                data: { fullName, title, bio, avatarUrl, resumeUrl, githubUrl, linkedinUrl, email },
            });
        } else {
            profile = await prisma.profile.create({
                data: { fullName, title, bio, avatarUrl, resumeUrl, githubUrl, linkedinUrl, email },
            });
        }

        res.json({ profile });
    } catch {
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// ==================== PROJECTS ====================

// GET /api/projects
export const getProjects = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ projects });
    } catch {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

// GET /api/projects/featured
export const getFeaturedProjects = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects = await prisma.project.findMany({
            where: { featured: true },
            orderBy: { order: "asc" },
        });
        res.json({ projects });
    } catch {
        res.status(500).json({ error: "Failed to fetch featured projects" });
    }
};

// GET /api/projects/:id
export const getProject = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id },
        });

        if (!project) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        res.json({ project });
    } catch {
        res.status(500).json({ error: "Failed to fetch project" });
    }
};

// POST /api/admin/projects
export const createProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { title, description, imageUrl, liveUrl, githubUrl, techStack, featured, order } = req.body;

        const project = await prisma.project.create({
            data: {
                title,
                description,
                imageUrl,
                liveUrl,
                githubUrl,
                techStack: techStack || [],
                featured: featured || false,
                order: order || 0,
            },
        });

        res.status(201).json({ project });
    } catch {
        res.status(500).json({ error: "Failed to create project" });
    }
};

// PUT /api/admin/projects/:id
export const updateProject = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json({ project });
    } catch {
        res.status(500).json({ error: "Failed to update project" });
    }
};

// DELETE /api/admin/projects/:id
export const deleteProject = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        await prisma.project.delete({
            where: { id: req.params.id },
        });

        res.json({ message: "Project deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete project" });
    }
};

// ==================== SKILLS ====================

// GET /api/skills
export const getSkills = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ skills });
    } catch {
        res.status(500).json({ error: "Failed to fetch skills" });
    }
};

// POST /api/admin/skills
export const createSkill = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, category, level, order } = req.body;

        const skill = await prisma.skill.create({
            data: {
                name,
                category,
                level: level || 50,
                order: order || 0,
            },
        });

        res.status(201).json({ skill });
    } catch {
        res.status(500).json({ error: "Failed to create skill" });
    }
};

// PUT /api/admin/skills/:id
export const updateSkill = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const skill = await prisma.skill.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json({ skill });
    } catch {
        res.status(500).json({ error: "Failed to update skill" });
    }
};

// DELETE /api/admin/skills/:id
export const deleteSkill = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        await prisma.skill.delete({
            where: { id: req.params.id },
        });

        res.json({ message: "Skill deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete skill" });
    }
};

// ==================== EXPERIENCE ====================

// GET /api/experience
export const getExperiences = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ experiences });
    } catch {
        res.status(500).json({ error: "Failed to fetch experiences" });
    }
};

// POST /api/admin/experience
export const createExperience = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { company, role, description, startDate, endDate, current, order } = req.body;

        const experience = await prisma.experience.create({
            data: {
                company,
                role,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                current: current || false,
                order: order || 0,
            },
        });

        res.status(201).json({ experience });
    } catch {
        res.status(500).json({ error: "Failed to create experience" });
    }
};

// PUT /api/admin/experience/:id
export const updateExperience = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const data = { ...req.body };
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);

        const experience = await prisma.experience.update({
            where: { id: req.params.id },
            data,
        });

        res.json({ experience });
    } catch {
        res.status(500).json({ error: "Failed to update experience" });
    }
};

// DELETE /api/admin/experience/:id
export const deleteExperience = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        await prisma.experience.delete({
            where: { id: req.params.id },
        });

        res.json({ message: "Experience deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete experience" });
    }
};

// ==================== CONTACT MESSAGES ====================

// POST /api/contact
export const createContactMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: "Name, email, and message are required" });
            return;
        }

        const contactMessage = await prisma.contactMessage.create({
            data: { name, email, message },
        });

        res.status(201).json({ message: "Message sent successfully", id: contactMessage.id });
    } catch {
        res.status(500).json({ error: "Failed to send message" });
    }
};

// GET /api/admin/messages
export const getContactMessages = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json({ messages });
    } catch {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// PUT /api/admin/messages/:id/read
export const markMessageAsRead = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const message = await prisma.contactMessage.update({
            where: { id: req.params.id },
            data: { read: true },
        });

        res.json({ message });
    } catch {
        res.status(500).json({ error: "Failed to update message" });
    }
};

// DELETE /api/admin/messages/:id
export const deleteContactMessage = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        await prisma.contactMessage.delete({
            where: { id: req.params.id },
        });

        res.json({ message: "Message deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete message" });
    }
};
