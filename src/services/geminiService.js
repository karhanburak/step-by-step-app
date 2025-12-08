import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env';

// Initialize with your API Key
const API_KEY = `${GEMINI_API_KEY}`;

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTaskSteps = async (taskDescription, image) => {
    try {
        console.log("DEBUG: API_KEY status:", API_KEY ? "Present" : "Missing/Undefined");

        // For development/demo without API key, return mock data if key is placeholder or missing
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            console.log("Gemini API Key missing or placeholder");
            throw new Error("API_KEY_MISSING");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let promptContent = [];

        const basePrompt = `
      Analyze the user's desired action (and image if provided) and break it down into logical sequential steps.
      User Request: "${taskDescription}"
      
      Return the response ONLY in the following JSON format, do not add any other text:
      {
        "taskTitle": "Task Title",
        "steps": [
          {"id": 1, "text": "Step 1", "completed": false, "note": ""},
          {"id": 2, "text": "Step 2", "completed": false, "note": ""}
        ]
      }
      Ensure the response is in the same language as the User Request.
    `;
        promptContent.push(basePrompt);

        if (image && image.base64) {
            promptContent.push({
                inlineData: {
                    data: image.base64,
                    mimeType: 'image/jpeg' // Expo image picker usually returns jpeg, but could be png
                }
            });
        }

        const result = await model.generateContent(promptContent);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const getHelpSuggestion = async (taskTitle, completedSteps, pendingSteps, userIssue) => {
    try {
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            throw new Error("API_KEY_MISSING");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      Task: ${taskTitle}
      Completed Steps: ${JSON.stringify(completedSteps)}
      Remaining Steps: ${JSON.stringify(pendingSteps)}
      User Issue: "${userIssue}"
      
      Generate a solution based on this situation. If a new list of steps is needed, suggest it.
      Return the response ONLY in JSON format:
      {
        "message": "Explanation message to the user",
        "suggestedSolution": [
           {"id": 1, "text": "New Step 1", "completed": false}
        ]
      }
      If no new list is needed, "suggestedSolution" can be an empty array.
      Ensure the response is in the same language as the User Issue.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Help Error:", error);
        throw error;
    }
};
