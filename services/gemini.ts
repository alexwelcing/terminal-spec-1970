
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from "../types";

export const compareSpecs = async (yaml1: string, yaml2: string): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Compare the following two OpenAPI YAML specifications and identify all changes. 
    Focus on added/removed endpoints, modified parameters, and breaking changes.
    
    For each change, provide a 'technicalDetail' field that gives a comprehensive technical explanation, 
    specifying exactly which parameters, types, or schema fields were altered, added, or removed.
    
    YAML 1 (Old):
    ${yaml1}
    
    YAML 2 (New):
    ${yaml2}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Overall summary of the changes" },
          versionOld: { type: Type.STRING },
          versionNew: { type: Type.STRING },
          changes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['ADDED', 'REMOVED', 'MODIFIED', 'BREAKING'] },
                endpoint: { type: Type.STRING },
                method: { type: Type.STRING },
                description: { type: Type.STRING, description: "A concise summary of the change for the board." },
                technicalDetail: { type: Type.STRING, description: "A detailed technical explanation of the change, including specific field names and type changes." },
                impact: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
              },
              required: ['type', 'endpoint', 'method', 'description', 'technicalDetail', 'impact']
            }
          }
        },
        required: ['summary', 'changes']
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as ComparisonResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid response format from comparison engine.");
  }
};
