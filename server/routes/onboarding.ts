import { Router } from "express";
import { storage } from "../storage";
import { upload } from "../services/upload";
import { z } from "zod";

const router = Router();

// Middleware to ensure user is logged in
const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

// 1. Identity Verification (Step 3)
router.post("/verify-identity", requireAuth, async (req, res) => {
    console.log("POST /verify-identity hit with body:", req.body);
    const { code } = req.body;
    // Simulate OTP verification
    if (code === "123456") {
        console.log("OTP correct, updating user...");
        const user = await storage.updateUser((req.user as any).id, {
            onboardingStatus: "verified",
            currentStep: "role_selection",
        });
        console.log("User updated:", user);
        return res.json({ message: "Identity verified", user });
    }
    console.log("Invalid OTP code provided:", code);
    res.status(400).json({ message: "Invalid OTP code" });
});

// 2. Role Selection (Step 4)
const roleSchema = z.object({
    role: z.enum(["student", "counselor", "admin", "partner"]),
});

router.post("/role", requireAuth, async (req, res) => {
    try {
        const { role } = roleSchema.parse(req.body);
        const user = await storage.updateUser((req.user as any).id, {
            role,
            currentStep: "profile_setup",
        });
        res.json({ message: "Role updated", user });
    } catch (err) {
        res.status(400).json({ message: "Invalid role" });
    }
});

// 3. Profile Setup (Step 5)
const profileSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z.string().optional(),
    // Add other profile fields as needed
});

router.post("/profile", requireAuth, async (req, res) => {
    try {
        const data = profileSchema.parse(req.body);
        const user = await storage.updateUser((req.user as any).id, {
            ...data,
            // Complete onboarding immediately
            onboardingStatus: "active",
            currentStep: "completed",
        });
        res.json({ message: "Profile updated", user });
    } catch (err) {
        res.status(400).json({ message: "Invalid profile data" });
    }
});

// 4. Document Submission (Step 6)
router.post("/documents", requireAuth, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { type } = req.body; // id_proof, etc.

    // Create document record
    const doc = await storage.createDocument({
        userId: (req.user as any).id,
        type: type || "general",
        path: req.file.path,
        status: "pending",
    });

    // Update user step
    const user = await storage.updateUser((req.user as any).id, {
        currentStep: "review_wait",
        onboardingStatus: "audit_pending"
    });

    res.json({ message: "Document uploaded", document: doc, user });
});

// 5. Consent (Step 9 - usually before review, but flow varies)
router.post("/consent", requireAuth, async (req, res) => {
    // Log consent...
    // For now, assuming step is complete
    res.json({ message: "Consent recorded" });
});

// 6. Admin Review (Step 7/8) - Simplified for prototype
router.post("/admin/review/:userId", requireAuth, async (req, res) => {
    // In real app, check 'req.user.role === "admin"'
    const { status, reason } = req.body; // status: "active" (approve) or "rejected"

    const user = await storage.updateUser(req.params.userId, {
        onboardingStatus: status,
        // if active, maybe set currentStep to 'completed'
        currentStep: status === 'active' ? 'completed' : 'rejected',
    });

    res.json({ message: `User ${status}`, user });
});

export default router;
