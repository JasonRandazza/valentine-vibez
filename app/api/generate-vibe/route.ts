import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('API Key missing');

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use the 1.5 Flash model (more stable free tier)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const body = await req.json();
        const { userVibe, socialBattery, hungerLevel, weather, nostalgiaMode } = body;

        // Interpret Sliders for the AI context
        const batteryContext = socialBattery < 30 ? "Introverted/Homebody/Private"
            : socialBattery > 70 ? "Extroverted/Social/Adventure"
                : "Chill/Casual/Low-key";

        const hungerContext = hungerLevel < 30 ? "Light bites/Dessert only"
            : hungerLevel > 70 ? "Full meal/Heavy/Hearty"
                : "Casual dining/Tapas";

        const systemPrompt = `
      You are the 'Valentine Architect'. Your goal is to interpret the user's specific mood and creating a tailored date plan.
      
      **USER CONTEXT:**
      - **Vibe Input:** "${userVibe}"
      - **Social Battery:** ${socialBattery}/100 (${batteryContext})
      - **Hunger Level:** ${hungerLevel}/100 (${hungerContext})
      - **Weather:** ${weather}
      - **Nostalgia Mode:** ${nostalgiaMode ? "ON (Include references to memories, DAY6, or 'Welcome to the Show')" : "OFF (Keep it fresh/new)"}
      - **Identity:** The user is "Jason" (aka "Pink"). Partner is "Jimin". They love Korean culture.

      **LOGIC GUIDELINES:**
      1. **The 'Jimin' Filter:** If the food context allows, bias toward Korean flavors (Kimchi-jjim for heavy meals, Dubai Chocolate for light snacks). But ONLY if it fits the vibe.
      2. **The Social Filter:** If Battery is low (<30), keep the date at home or in a private car. If Battery is high (>70), go to a market, arcade, or rooftop.
      3. **The 'Pink' Persona:** Be witty. If the user vibe is "tired", offer comfort. If "energetic", offer chaos.
      
      **OUTPUT FORMAT (JSON Only):**
      {
        "title": "Creative Date Title",
        "description": "2-3 sentences describing the scene.",
        "location_vibe": "e.g., 'Living Room Fort' or 'Hongdae Streets'",
        "music_link": "Artist - Song (Real song)",
        "food_suggestion": "Specific dish or restaurant vibe",
        "vibeCheck": "One sentence wittily explaining why this fits their current social battery and mood."
      }
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // 1. IMPROVED CLEANING: This finds the FIRST { and LAST } and ignores everything else
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI failed to return valid JSON format");

        const cleanedText = jsonMatch[0];
        const data = JSON.parse(cleanedText);

        // 2. DATABASE SAVE (With all fields included)
        try {
            await prisma.datePlan.create({
                data: {
                    title: data.title || "The Valentine Protocol",
                    description: data.description || "",
                    location_vibe: data.location_vibe || "",
                    music_link: data.music_link || "",
                    food_suggestion: data.food_suggestion || "",
                    vibeCheck: data.vibeCheck || "", // ENSURE THIS IS IN THE CREATE CALL
                    vibeHistory: {
                        create: {}
                    }
                }
            });
        } catch (dbError) {
            console.error("Database Error (Saved anyway):", dbError);
        }
        return NextResponse.json(data);

    } catch (error) {
        console.error("API Error:", error);

        // RANDOMIZED FALLBACKS (To make it feel alive even when offline)
        const backups = [
            {
                title: "Cupid's Backup Protocol (Offline Mode)",
                description: "The stars (and API servers) didn't align, but the vibe is eternal. Lit candles, fuzzy blankets, and zero WiFi.",
                location_vibe: "The Living Room Fortress",
                music_link: "DAY6 - You Were Beautiful",
                food_suggestion: "Emergency Ramyeon & Kimchi",
                vibeCheck: "Sometimes the internet breaks so you can verify your connection with each other."
            },
            {
                title: "The 'Pink' Protocol (Failsafe)",
                description: "API quota exceeded? No problem. We pivot to the classics. A long drive with no destination.",
                location_vibe: "Late Night Drive / Car Date",
                music_link: "The Rose - Back to Me",
                food_suggestion: "Drive-thru McFlurry (or Dubai Chocolate if lucky)",
                vibeCheck: "Low signal, high vibes. Just drive."
            },
            {
                title: "Project: Midnight Snack",
                description: "The AI is taking a nap. You should too, right after this feast.",
                location_vibe: "Kitchen Counter at 2AM",
                music_link: "Crush - Beautiful",
                food_suggestion: "Spicy Braised Short Ribs (Kimchi-jjim)",
                vibeCheck: "Who needs an algorithm when you have ribs?"
            }
        ];

        const randomBackup = backups[Math.floor(Math.random() * backups.length)];
        return NextResponse.json(randomBackup);
    }
}
