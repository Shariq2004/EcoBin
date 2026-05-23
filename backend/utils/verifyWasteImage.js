const { GoogleGenAI } = require("@google/genai");

const verifyWasteImage = async (imageBuffer, mimeType) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const base64Image = imageBuffer.toString("base64");

    const prompt = `
You are a waste classification AI.
Analyze the image and return ONLY JSON. No extra text.

Return exactly this format:
{
  "isWaste": true/false,
  "wasteType": "Plastic waste / Organic waste / Paper waste / Metal waste / Glass waste / Mixed waste / Dry waste / Wet waste",
  "quantity": "Approximately in kg, 
  "confidence": "__%"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
    });

    // ✅ SAFE TEXT EXTRACTION
    let aiText = "";

    try {
      aiText = response.text();
    } catch {
      aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!aiText || aiText.trim().length < 5) {
      throw new Error("AI returned empty response");
    }

    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      throw new Error("Invalid JSON from AI: " + aiText);
    }

    console.log("Gemini Parsed Response:", parsed);

    // ❌ If not waste
    if (!parsed.isWaste) {
      return {
        success: false,
        error: "Please upload a valid waste image.",
        aiOutput: parsed,
      };
    }

    // ✅ SUCCESS RESPONSE (Exactly like your router)
    return {
      success: true,
      message: "Verification successful",
      wasteType: parsed.wasteType,
      quantity: parsed.quantity,
      confidence: parsed.confidence,
      aiOutput: parsed,
    };
  } catch (error) {
    console.error("Gemini Error:", error.message);

    return {
      success: false,
      error: "AI verification failed",
      details: error.message,
    };
  }
};

module.exports = { verifyWasteImage };
