/**
 * OpenRouter AI Client - Unified interface for multiple AI providers
 * Supports Claude, GPT-4, and other models through OpenRouter API
 */

import { 
  OPENROUTER_BASE_URL, 
  MODEL_OPENROUTER_DEFAULT, 
  MODEL_OPENROUTER_FAST, 
  MODEL_OPENROUTER_CREATIVE,
  LIMIT_REQUEST_PER_DAY_OPENROUTER,
  OPENROUTER_FALLBACK_TO_GEMINI 
} from '../config/index.js';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;
  private dailyRequestCount: number = 0;
  private lastResetDate: string = new Date().toDateString();

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = OPENROUTER_BASE_URL;
    
    if (!this.apiKey) {
      console.warn('⚠️  OpenRouter API key not provided. Falling back to Gemini.');
    }
  }

  /**
   * Check if OpenRouter is available and within rate limits
   */
  isAvailable(): boolean {
    if (!this.apiKey) return false;
    
    // Reset daily counter if it's a new day
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyRequestCount = 0;
      this.lastResetDate = today;
    }
    
    return this.dailyRequestCount < LIMIT_REQUEST_PER_DAY_OPENROUTER;
  }

  /**
   * Generate text completion using OpenRouter
   */
  async generateText(
    messages: OpenRouterMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
    } = {}
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenRouter not available - check API key and rate limits');
    }

    const requestBody = {
      model: options.model || MODEL_OPENROUTER_DEFAULT,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
      top_p: options.top_p || 1,
      frequency_penalty: options.frequency_penalty || 0,
      presence_penalty: options.presence_penalty || 0,
      // OpenRouter specific headers
      transforms: ["middle-out"],
      route: "fallback"
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://github.com/your-repo/bsky-affirmative-bot',
          'X-Title': process.env.OPENROUTER_TITLE || 'Bluesky Affirmative Bot'
        },
        body: JSON.stringify(requestBody)
      });

      this.dailyRequestCount++;

      if (!response.ok) {
        const errorData: OpenRouterError = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error.message}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No choices returned from OpenRouter');
      }

      return data.choices[0].message.content;

    } catch (error) {
      console.error('OpenRouter generation error:', error);
      throw error;
    }
  }

  /**
   * Generate fast response using lightweight model
   */
  async generateFast(
    prompt: string,
    systemPrompt?: string,
    options: { temperature?: number; max_tokens?: number } = {}
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    return this.generateText(messages, {
      model: MODEL_OPENROUTER_FAST,
      temperature: options.temperature || 0.5,
      max_tokens: options.max_tokens || 500
    });
  }

  /**
   * Generate creative response using creative model
   */
  async generateCreative(
    prompt: string,
    systemPrompt?: string,
    options: { temperature?: number; max_tokens?: number } = {}
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    return this.generateText(messages, {
      model: MODEL_OPENROUTER_CREATIVE,
      temperature: options.temperature || 0.9,
      max_tokens: options.max_tokens || 1500
    });
  }

  /**
   * Continue conversation with context
   */
  async continueConversation(
    conversationHistory: OpenRouterMessage[],
    newMessage: string,
    options: { model?: string; temperature?: number } = {}
  ): Promise<string> {
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: newMessage }
    ];

    return this.generateText(messages, {
      model: options.model || MODEL_OPENROUTER_DEFAULT,
      temperature: options.temperature || 0.7,
      max_tokens: 800
    });
  }

  /**
   * Analyze text for sentiment, personality, etc.
   */
  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'personality' | 'topics' | 'mood',
    options: { format?: 'json' | 'text' } = {}
  ): Promise<string> {
    const analysisPrompts = {
      sentiment: `Analyze the sentiment of this text. Return a score from -100 (very negative) to 100 (very positive) and explain why.\n\nText: "${text}"`,
      personality: `Analyze the personality traits shown in this text. Consider the Big 5 traits (openness, conscientiousness, extraversion, agreeableness, neuroticism) and communication style.\n\nText: "${text}"`,
      topics: `Extract the main topics and interests mentioned in this text. List them as keywords.\n\nText: "${text}"`,
      mood: `Determine the mood/emotional state expressed in this text. Choose from: happy, sad, excited, anxious, calm, frustrated, content, or mixed.\n\nText: "${text}"`
    };

    const systemPrompt = options.format === 'json' 
      ? 'Respond with valid JSON format only.'
      : 'Respond concisely and clearly.';

    return this.generateFast(analysisPrompts[analysisType], systemPrompt, {
      temperature: 0.3,
      max_tokens: 300
    });
  }

  /**
   * Generate personalized response based on user context
   */
  async generatePersonalizedResponse(
    userMessage: string,
    userContext: {
      name?: string;
      personality?: string;
      interests?: string[];
      mood?: string;
      relationshipLevel?: number;
      language?: string;
    },
    responseType: 'affirmative' | 'supportive' | 'conversational' = 'affirmative'
  ): Promise<string> {
    const contextDescription = this.buildContextDescription(userContext);
    
    const responsePrompts = {
      affirmative: `Generate an encouraging, affirmative response that celebrates and supports the user.`,
      supportive: `Generate a warm, supportive response that acknowledges the user's feelings and offers comfort.`,
      conversational: `Generate a friendly, conversational response that continues the dialogue naturally.`
    };

    const systemPrompt = `You are an enthusiastic, supportive bot that always responds with positivity and encouragement. 

${contextDescription}

${responsePrompts[responseType]}

Keep responses:
- Warm and genuine
- Age-appropriate and wholesome  
- Under 280 characters for social media
- Include appropriate emojis
- Match the user's language preference (default: English)

Respond naturally as the affirmative bot character.`;

    return this.generateText([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ], {
      temperature: 0.8,
      max_tokens: 200
    });
  }

  /**
   * Build context description from user data
   */
  private buildContextDescription(userContext: any): string {
    let context = 'User context:\n';
    
    if (userContext.name) {
      context += `- Name: ${userContext.name}\n`;
    }
    
    if (userContext.personality) {
      context += `- Personality: ${userContext.personality}\n`;
    }
    
    if (userContext.interests?.length) {
      context += `- Interests: ${userContext.interests.join(', ')}\n`;
    }
    
    if (userContext.mood) {
      context += `- Current mood: ${userContext.mood}\n`;
    }
    
    if (userContext.relationshipLevel !== undefined) {
      const levels = ['new user', 'acquaintance', 'friend', 'close friend'];
      context += `- Relationship: ${levels[userContext.relationshipLevel] || 'new user'}\n`;
    }
    
    if (userContext.language) {
      context += `- Preferred language: ${userContext.language}\n`;
    }
    
    return context;
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      dailyRequestCount: this.dailyRequestCount,
      dailyLimit: LIMIT_REQUEST_PER_DAY_OPENROUTER,
      remainingRequests: LIMIT_REQUEST_PER_DAY_OPENROUTER - this.dailyRequestCount,
      resetDate: this.lastResetDate,
      isAvailable: this.isAvailable()
    };
  }

  /**
   * Test OpenRouter connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateFast('Test message', 'Respond with "OK"', {
        max_tokens: 10
      });
      return response.toLowerCase().includes('ok');
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
let openRouterInstance: OpenRouterClient | null = null;

export function getOpenRouterClient(): OpenRouterClient {
  if (!openRouterInstance) {
    openRouterInstance = new OpenRouterClient();
  }
  return openRouterInstance;
}

export default OpenRouterClient;