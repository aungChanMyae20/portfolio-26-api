import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getProfile,
    updateProfile,
    getProjects,
    getFeaturedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    createContactMessage,
    getContactMessages,
    markMessageAsRead,
    deleteContactMessage,
} from "../controllers/portfolioController.js";

const router = Router();

// ==================== PUBLIC ROUTES ====================

// Profile
router.get("/profile", getProfile);

// Projects
router.get("/projects", getProjects);
router.get("/projects/featured", getFeaturedProjects);
router.get("/projects/:id", getProject);

// Skills
router.get("/skills", getSkills);

// Experience
router.get("/experience", getExperiences);

// Contact
router.post("/contact", createContactMessage);

// ==================== ADMIN ROUTES (Protected) ====================

// Profile
router.put("/admin/profile", authMiddleware, updateProfile);

// Projects
router.post("/admin/projects", authMiddleware, createProject);
router.put("/admin/projects/:id", authMiddleware, updateProject);
router.delete("/admin/projects/:id", authMiddleware, deleteProject);

// Skills
router.post("/admin/skills", authMiddleware, createSkill);
router.put("/admin/skills/:id", authMiddleware, updateSkill);
router.delete("/admin/skills/:id", authMiddleware, deleteSkill);

// Experience
router.post("/admin/experience", authMiddleware, createExperience);
router.put("/admin/experience/:id", authMiddleware, updateExperience);
router.delete("/admin/experience/:id", authMiddleware, deleteExperience);

// Contact Messages
router.get("/admin/messages", authMiddleware, getContactMessages);
router.put("/admin/messages/:id/read", authMiddleware, markMessageAsRead);
router.delete("/admin/messages/:id", authMiddleware, deleteContactMessage);

export default router;
