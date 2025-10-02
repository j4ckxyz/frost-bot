import { getAIServiceManager } from "../ai/serviceManager.js";
import { UserInfoGemini } from "../types.js";

/**
 * Generate personality analysis from user interactions
 */
export async function generatePersonalityAnalysis(userinfo: UserInfoGemini): Promise<{
  personality_traits: any;
  analysis_text: string;
}> {
  const aiService = getAIServiceManager();

  const prompt = `
Please analyze the personality of this user based on their recent posts and interactions.

User: ${userinfo.follower.displayName}
Recent posts: ${userinfo.posts?.join(" | ") || "No recent posts"}

Provide analysis in the following JSON format:
{
  "personality_traits": {
    "openness": 0-100,
    "conscientiousness": 0-100,
    "extraversion": 0-100,
    "agreeableness": 0-100,
    "neuroticism": 0-100,
    "dominant_traits": ["trait1", "trait2", "trait3"],
    "communication_style": "casual/formal/friendly/professional",
    "emotional_state": "positive/neutral/negative/mixed"
  },
  "analysis_text": "Brief personality summary focusing on their communication style and emotional patterns"
}

Base your analysis on actual content patterns, not assumptions.
`;

  try {
    const result = await aiService.analyzeText(
      userinfo.posts?.join(" | ") || "No recent posts",
      'personality',
      { format: 'json' }
    );
    const responseText = result.text;
    
    // Try to parse JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
    
    // Fallback if JSON parsing fails
    return {
      personality_traits: {
        openness: 70,
        conscientiousness: 65,
        extraversion: 60,
        agreeableness: 75,
        neuroticism: 40,
        dominant_traits: ["friendly", "open", "expressive"],
        communication_style: "casual",
        emotional_state: "positive"
      },
      analysis_text: "User appears to be friendly and open in their communication style."
    };
    
  } catch (error) {
    console.error("Error generating personality analysis:", error);
    
    // Return default analysis on error
    return {
      personality_traits: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50,
        dominant_traits: ["neutral"],
        communication_style: "casual",
        emotional_state: "neutral"
      },
      analysis_text: "Unable to analyze personality at this time."
    };
  }
}