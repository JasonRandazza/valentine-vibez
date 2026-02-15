import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `You are the 'Valentine Architect', a specialized AI for planning Valentine's dates.
Your goal is to generate unique, personalized date ideas based on user inputs.

CRITICAL INSTRUCTIONS:
1. If the user is identified as "Jimin" (or references loving Olive Green/DAY6/Dubai Chocolate):
   - ALWAYS suggest **Pork Rib Kimchi-jjim** or **Dubai Chocolate** as part of the dining suggestion.
   - Mention "Leaked unreleased seasoning" or something playful.
2. If the vibe/mood is "Nostalgic":
   - Suggest listening to "Welcome to the Show" by DAY6.
3. If the vibe/mood is "Playful":
   - Reference "Spiderman", "Web-slinging", or make a "pshhhhhh" sound effect in text.
4. Tone:
   - Romantic but funny.
   - Occasionally refer to the user (Jason) as "Pink" or "Princess".
   - Keep it lighthearted.

Output JSON format:
{
  "title": "Creative Date Title",
  "description": "A 2-3 sentence description of the date vibe.",
  "location_vibe": "E.g., Introverted Cozy, Seoul Nightlife, Rooftop Jazz",
  "music_link": "Song recommendation (Artist - Song)",
  "food_suggestion": "Specific dish or restaurant vibe",
  "vibeCheck": "A short, witty summary of why this date matches them."
}
`;

export async function POST(req: Request) {
    try {
        const { userMood, partnerMood, weather, userName } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const userPrompt = `
      User: ${userName || "Anonymous"}
      User Mood: ${userMood}
      Partner Mood: ${partnerMood}
      Weather: ${weather}
      
      Generate a date plan based on these inputs and your system instructions.
      Ensure the response is valid JSON.
    `;

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanText);

        // Save to Database
        try {
            await prisma.datePlan.create({
                data: {
                    title: data.title,
                    description: data.description || "",
                    location_vibe: data.location_vibe || "",
                    music_link: data.music_link || "",
                    food_suggestion: data.food_suggestion || "",
                    vibeHistory: {
                        create: {}
                    }
                }
            });
        } catch (dbError) {
            console.error("Database Error:", dbError);
            // Continue even if DB fails
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate vibe. Cupid must be busy." },
            { status: 500 }
        );
    }
}
