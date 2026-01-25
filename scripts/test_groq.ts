
import Groq from "groq-sdk";
import "dotenv/config";

async function test() {
    console.log("Checking Environment...");
    const key = process.env.GROQ_API_KEY;
    if (!key) {
        console.error("❌ GROQ_API_KEY is missing from process.env");
        return;
    }
    console.log(`✅ API Key found: ${key.substring(0, 10)}...`);

    const groq = new Groq({ apiKey: key });

    console.log("Testing connection...");
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "llama3-8b-8192",
        });
        console.log("✅ Success! Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("❌ API Error:", error);
    }
}

test();
