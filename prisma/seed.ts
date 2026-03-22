import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...\n");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const user = await prisma.user.upsert({
        where: { email: "admin@portfolio.com" },
        update: {},
        create: {
            email: "admin@portfolio.com",
            password: hashedPassword,
            name: "Admin",
        },
    });
    console.log(`✅ Admin user created: ${user.email}`);

    // Create profile
    const profile = await prisma.profile.create({
        data: {
            fullName: "Your Name",
            title: "Full Stack Developer",
            bio: "I'm a passionate developer who loves building modern web applications with cutting-edge technologies. I enjoy solving complex problems and creating beautiful user experiences.",
            avatarUrl: null,
            resumeUrl: null,
            githubUrl: "https://github.com/yourusername",
            linkedinUrl: "https://linkedin.com/in/yourusername",
            email: "hello@yourdomain.com",
        },
    });
    console.log(`✅ Profile created: ${profile.fullName}`);

    // Create sample projects
    const projects = await Promise.all([
        prisma.project.create({
            data: {
                title: "E-Commerce Platform",
                description:
                    "A full-featured e-commerce platform built with React and Node.js. Features include user authentication, shopping cart, payment processing, and order management.",
                imageUrl: null,
                liveUrl: "https://example.com",
                githubUrl: "https://github.com/yourusername/ecommerce",
                techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
                featured: true,
                order: 1,
            },
        }),
        prisma.project.create({
            data: {
                title: "Task Management App",
                description:
                    "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
                imageUrl: null,
                liveUrl: "https://example.com",
                githubUrl: "https://github.com/yourusername/taskapp",
                techStack: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
                featured: true,
                order: 2,
            },
        }),
        prisma.project.create({
            data: {
                title: "Weather Dashboard",
                description:
                    "A beautiful weather dashboard that displays current conditions, forecasts, and interactive weather maps with location-based data.",
                imageUrl: null,
                liveUrl: "https://example.com",
                githubUrl: "https://github.com/yourusername/weather",
                techStack: ["React", "TypeScript", "OpenWeatherAPI", "Chart.js"],
                featured: false,
                order: 3,
            },
        }),
    ]);
    console.log(`✅ ${projects.length} projects created`);

    // Create sample skills
    const skills = await Promise.all([
        prisma.skill.create({ data: { name: "React", category: "Frontend", level: 90, order: 1 } }),
        prisma.skill.create({ data: { name: "TypeScript", category: "Frontend", level: 85, order: 2 } }),
        prisma.skill.create({ data: { name: "Next.js", category: "Frontend", level: 80, order: 3 } }),
        prisma.skill.create({ data: { name: "Node.js", category: "Backend", level: 85, order: 4 } }),
        prisma.skill.create({ data: { name: "PostgreSQL", category: "Backend", level: 75, order: 5 } }),
        prisma.skill.create({ data: { name: "Prisma", category: "Backend", level: 80, order: 6 } }),
        prisma.skill.create({ data: { name: "Docker", category: "DevOps", level: 70, order: 7 } }),
        prisma.skill.create({ data: { name: "Git", category: "DevOps", level: 90, order: 8 } }),
    ]);
    console.log(`✅ ${skills.length} skills created`);

    // Create sample experience
    const experiences = await Promise.all([
        prisma.experience.create({
            data: {
                company: "Tech Startup Inc.",
                role: "Senior Full Stack Developer",
                description:
                    "Led development of the core product platform, mentored junior developers, and implemented CI/CD pipelines.",
                startDate: new Date("2023-01-01"),
                endDate: null,
                current: true,
                order: 1,
            },
        }),
        prisma.experience.create({
            data: {
                company: "Digital Agency Co.",
                role: "Full Stack Developer",
                description:
                    "Built responsive web applications for clients across various industries using React and Node.js.",
                startDate: new Date("2021-06-01"),
                endDate: new Date("2022-12-31"),
                current: false,
                order: 2,
            },
        }),
    ]);
    console.log(`✅ ${experiences.length} experiences created`);

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📧 Admin login credentials:");
    console.log("   Email: admin@portfolio.com");
    console.log("   Password: admin123\n");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
