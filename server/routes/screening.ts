
import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { analyzeAssessmentAI } from "../services/ai";

const router = Router();

// Middleware to ensure user is logged in
const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

const answerSchema = z.record(z.string(), z.number()); // q1: 3, q2: 1...

router.post("/submit", requireAuth, async (req, res) => {
    try {
        const { answers } = req.body;

        // Calculate Score
        // Simple summation for this demo
        const totalScore = Object.values(answers).reduce((acc: number, curr: any) => acc + (Number(curr) || 0), 0);

        let riskLevel = "low";
        if (totalScore >= 15) riskLevel = "severe";
        else if (totalScore >= 10) riskLevel = "moderate";

        // Generate AI Analysis
        const aiAnalysis = await analyzeAssessmentAI(answers, totalScore);

        const assessment = await storage.createScreeningAssessment({
            userId: (req.user as any).id,
            score: totalScore,
            riskLevel,
            answers: JSON.stringify(answers),
            aiAnalysis,
        });

        // Update user's latest risk level for Admin visibility
        await storage.updateUser((req.user as any).id, { latestRiskLevel: riskLevel } as any);

        // If severe, update user status to flag for admin attention (optional implementation detail)
        // For now, we rely on the Admin Dashboard to read the screening table or user join

        res.json(assessment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit assessment" });
    }
});

router.get("/history", requireAuth, async (req, res) => {
    const history = await storage.getScreeningHistory((req.user as any).id);
    res.json(history);
});

export default router;
