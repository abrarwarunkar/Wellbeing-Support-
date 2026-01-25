
import "dotenv/config"; // Load env vars
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "../server/db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function seedAdmin() {
    console.log("Seeding admin user...");

    const username = "admin";
    const password = "admin123";

    // Check if admin exists
    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length > 0) {
        console.log("Admin user already exists.");
        // Optional: Update password
        const hashedPassword = await hashPassword(password);
        await db.update(users).set({
            password: hashedPassword,
            role: "admin",
            onboardingStatus: "active",
            currentStep: "completed"
        }).where(eq(users.username, username));
        console.log("Admin user updated with default credentials.");
    } else {
        const hashedPassword = await hashPassword(password);
        await db.insert(users).values({
            username,
            password: hashedPassword,
            role: "admin",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            onboardingStatus: "active",
            currentStep: "completed",
        });
        console.log("Admin user created.");
    }

    console.log(`
    Credentials:
    Username: ${username}
    Password: ${password}
    `);

    process.exit(0);
}

seedAdmin().catch(console.error);
