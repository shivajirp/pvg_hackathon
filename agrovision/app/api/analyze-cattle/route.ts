import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables.");
}

async function getBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const base64Image = await getBase64(file);

    const prompt = `
Analyze this image of cattle for signs of disease.
Specifically, look for:
- Skin lesions, ulcers, or unusual growths.
- Signs of lameness or difficulty walking.
- Discharge from the eyes, nose, or mouth.
- Swelling or inflammation.
- Changes in coat condition.
- Any other abnormalities.

Respond ONLY in JSON format with the following structure:
{
  "cattle_diseases": [
    {
      "name": "Disease Name",
      "symptoms": ["Symptom1", "Symptom2"],
      "possible_causes": ["Cause1", "Cause2"]
    }
  ],
  "remedies": [
    {
      "disease": "Disease Name",
      "treatment": "Treatment plan",
      "prevention": "Prevention tips"
    }
  ]
}
Do not include any extra text.
`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: file.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      let responseText = data.candidates[0].content.parts[0].text.trim();

      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/```json\s*|\s*```/g, "").trim();
      }

      try {
        const parsedResponse = JSON.parse(responseText);
        return NextResponse.json(parsedResponse);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid JSON response", raw: responseText },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "No valid response from Gemini API", raw: data },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
