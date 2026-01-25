
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Mock response generator for fallback
function generateMockAnalysis(answers: Record<string, number>, totalScore: number): string {
    const severe = totalScore >= 15;
    const moderate = totalScore >= 10;

    if (severe) {
        return `Based on your responses, you seem to be experiencing significant distress. 
    
    **Key Observations:**
    - High levels of reported difficulty in daily functioning.
    - Consistent patterns of low mood or anxiety.
    
    **Recommendation:**
    It is highly recommended to speak with a professional counselor. While self-care is important, professional guidance can provide structured support to help you navigate these feelings effectively.`;
    } else if (moderate) {
        return `Your responses indicate moderate levels of stress or anxiety.
    
    **Key Observations:**
    - You are managing, but some days are harder than others.
    - There may be specific triggers affecting your sleep or mood.
    
    **Recommendation:**
    Consider joining our peer support forum or trying our guided meditation resources. Establishing a routine can also be very helpful.`;
    } else {
        return `You appear to be doing relatively well!
    
    **Key Observations:**
    - You have good resilience and coping mechanisms.
    - Occasional stress is normal, but you are handling it effectively.
    
    **Recommendation:**
    Keep up your healthy habits! You might enjoy our community events to stay connected.`;
    }
}

export async function analyzeAssessmentAI(answers: Record<string, number>, totalScore: number): Promise<string> {
    if (!process.env.GROQ_API_KEY) {
        console.log("Missing GROQ_API_KEY, using mock.");
        return generateMockAnalysis(answers, totalScore);
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an empathetic mental health assistant. Analyze the user's questionnaire answers (GAD-7/PHQ-9 style) and provide a supportive, non-clinical summary of their mental state and actionable self-care recommendations. Do NOT diagnose. Keep it under 150 words."
                },
                {
                    role: "user",
                    content: `Total Score: ${totalScore}. Answers: ${JSON.stringify(answers)}`
                }
            ],
        });
        return response.choices[0]?.message?.content || generateMockAnalysis(answers, totalScore);
    } catch (error) {
        console.error("Groq API Error:", error);
        return generateMockAnalysis(answers, totalScore);
    }
}

export async function chatCompletionAI(message: string): Promise<string> {
    if (!process.env.GROQ_API_KEY) {
        return "I'm a simulated AI Counselor. Please configure GROQ_API_KEY.";
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a supportive, empathetic AI counselor. Listen actively and provide brief, comforting responses." },
                { role: "user", content: message }
            ],
        });
        return response.choices[0]?.message?.content || "I am here for you.";
    } catch (error) {
        console.error("Groq Chat Error:", error);
        return "I am having trouble connecting right now, but I am listening.";
    }
}

export async function detectCrisis(text: string): Promise<{ riskLevel: 'low' | 'moderate' | 'severe'; reason: string }> {
    if (!process.env.GROQ_API_KEY) {
        const lower = text.toLowerCase();
        if (lower.includes("suicide") || lower.includes("kill myself") || lower.includes("hopeless") || lower.includes("die")) {
            return { riskLevel: 'severe', reason: 'Keywords detected in mock mode.' };
        }
        return { riskLevel: 'low', reason: 'No crisis keywords.' };
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Analyze the following text for instant mental health crisis risk (suicide, self-harm, extreme distress). Return valid JSON only: { \"riskLevel\": \"low\"|\"moderate\"|\"severe\", \"reason\": \"brief explanation\" }." },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");
        return {
            riskLevel: content.riskLevel || 'low',
            reason: content.reason || 'AI Analysis'
        };
    } catch (error) {
        console.error("Groq Crisis Detect Error:", error);
        return { riskLevel: 'low', reason: 'Error in analysis' };
    }
}

// Generate personalized wellness actions (Generative AI)
export async function getWellnessActions(
    userContext: { mood?: string; note?: string }
): Promise<any[]> {
    if (!process.env.GROQ_API_KEY) {
        return [
            { title: "Take a breath", description: "Pause for 5 minutes and focus on your breathing." },
            { title: "Walk outside", description: "Fresh air can help clear your mind." },
            { title: "Journal", description: "Write down 3 things you are grateful for." }
        ];
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert behavioral psychologist. 
                    Given the User's recent mood and note, generate 3 specific, actionable, and novel "Wellness Micro-Habits" for them to try today.
                    Do NOT suggest generic things like "Meditate" or "Sleep". Be creative and specific (e.g., "The Coffee Mindfulness Ritual").
                    Return valid JSON: { "actions": [ { "title": "Catchy Title", "description": "One sentence instruction" } ] }`
                },
                {
                    role: "user",
                    content: `User Context: ${JSON.stringify(userContext)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");
        return content.actions || [];

    } catch (error) {
        console.error("Groq Actions Error:", error);
        return [];
    }
}

// Admin: Analyze aggregate campus data
export async function getInstitutionalInsights(
    texts: string[]
): Promise<{ summary: string; topConcerns: string[]; recommendation: string }> {
    if (!process.env.GROQ_API_KEY || texts.length === 0) {
        return {
            summary: "Insufficient data for AI analysis properly.",
            topConcerns: ["N/A"],
            recommendation: "Encourage more student engagement to generate insights."
        };
    }

    const compiledText = texts.slice(0, 50).join(" ... "); // Limit context window

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a Chief Wellbeing Officer for a university. 
                    Analyze the provided list of anonymous user thoughts/posts. 
                    Identify the collective mood, top 3 recurring themes/stressors (e.g. Exams, Loneliness), and 1 strategic high-level intervention.
                    Return valid JSON: { "summary": "1 sentence overview", "topConcerns": ["Concern 1", "Concern 2"], "recommendation": "Strategic advice" }`
                },
                {
                    role: "user",
                    content: `Anonymous Student Voices: ${compiledText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");
        return {
            summary: content.summary || "Analysis complete.",
            topConcerns: content.topConcerns || [],
            recommendation: content.recommendation || "Monitor situation."
        };
    } catch (error) {
        console.error("Groq Admin Insights Error:", error);
        return { summary: "AI unavailable", topConcerns: [], recommendation: "Check logs" };
    }
}
