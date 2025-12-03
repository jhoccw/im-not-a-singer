import { GoogleGenAI, Type } from "@google/genai";
import { SongInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export const fetchLyrics = async (title: string, artist: string): Promise<string[]> => {
  try {
    const prompt = `
      Write complete lyrics for the song "${title}" by "${artist}".
      If the song is instrumental or famous, generate appropriate lyrics or a poetic description that matches the vibe.
      Format the output as plain text with line breaks. Separate stanzas with a double newline.
      Do not include labels like [Chorus] or [Verse] or (Intro). Just the lyrics.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: "You are a professional songwriter and music database assistant.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text || "Lyrics unavailable.";
    // Split by newlines and filter out empty strings if needed, 
    // but preserving structure is better for display.
    return text.split('\n');
  } catch (error) {
    console.error("Gemini API Error (Lyrics):", error);
    return ["Could not load lyrics.", "Please check your connection."];
  }
};

export const fetchSongInsight = async (title: string, artist: string): Promise<SongInsight> => {
  try {
    const prompt = `Analyze the song "${title}" by "${artist}". Provide a very brief "mood" (1-2 words) and a short "meaning" (max 20 words).`;
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            meaning: { type: Type.STRING }
          },
          required: ["mood", "meaning"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as SongInsight;
    }
    return { mood: "Unknown", meaning: "No insight available." };
  } catch (error) {
    console.error("Gemini API Error (Insight):", error);
    return { mood: "Unknown", meaning: "Could not analyze song." };
  }
};
