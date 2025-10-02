/**
 * AI Service Manager - Unified interface for OpenRouter and Gemini
 * Handles fallbacks, service selection, and request routing
 */

import { GoogleGenerativeAI } from "@google/genai";
import { OpenRouterClient, getOpenRouterClient } from '../openrouter/client.js';
import { 
  AI_SERVICE_PREFERENCE, 
  OPENROUTER_FALLBACK_TO_GEMINI,
  USE_OPENROUTER_FOR_CONVERSATION,
  USE_OPENROUTER_FOR_GENERATION,
  MODEL_GEMINI,
  MODEL_GEMINI_LITE,
  SYSTEM_INSTRUCTION
} from '../config/index.js';
import { UserInfoGemini } from '../types.js';

export type AIServiceType = 'openrouter' | 'gemini' | 'mixed';
export type RequestType = 'conversation' | 'generation' | 'analysis' | 'embedding';

export interface AIResponse {
  text: string;
  service: 'openrouter' | 'gemini';
  model: string;
  responseTime: number;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export class AIServiceManager {
  private openRouterClient: OpenRouterClient;
  private geminiClient: GoogleGenerativeAI;
  private requestCounts = {
    openrouter: 0,
    gemini: 0,
    failed: 0
  };

  constructor() {
    this.openRouterClient = getOpenRouterClient();
    this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  /**
   * Generate AI response with service selection and fallback
   */
  async generateResponse(
    prompt: string,
    requestType: RequestType,
    options: {
      systemPrompt?: string;
      userInfo?: UserInfoGemini;
      temperature?: number;
      maxTokens?: number;
      preferredService?: AIServiceType;
    } = {}
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Determine which service to use
    const serviceToUse = this.determineService(requestType, options.preferredService);
    
    try {
      // Try primary service
      const response = await this.callService(serviceToUse, prompt, requestType, options);
      response.responseTime = Date.now() - startTime;
      return response;
      
    } catch (error) {
      console.warn(`[AI] ${serviceToUse} failed, attempting fallback:`, error);
      
      // Try fallback service
      if (OPENROUTER_FALLBACK_TO_GEMINI && serviceToUse === 'openrouter') {
        try {
          const fallbackResponse = await this.callService('gemini', prompt, requestType, options);
          fallbackResponse.responseTime = Date.now() - startTime;
          console.log(`[AI] Successfully fell back to Gemini`);
          return fallbackResponse;
          
        } catch (fallbackError) {
          console.error(`[AI] Both services failed:`, fallbackError);
          this.requestCounts.failed++;
          throw new Error(`All AI services failed: ${error}, ${fallbackError}`);
        }
      } else {
        this.requestCounts.failed++;
        throw error;
      }
    }
  }

  /**
   * Generate conversation response (supports context)
   */
  async generateConversationResponse(
    userMessage: string,
    userInfo: UserInfoGemini,
    options: {
      history?: any[];
      temperature?: number;
    } = {}
  ): Promise<AIResponse> {
    const systemPrompt = this.buildConversationSystemPrompt(userInfo);
    
    // Use OpenRouter for conversations if enabled
    if (USE_OPENROUTER_FOR_CONVERSATION && this.openRouterClient.isAvailable()) {
      try {
        return await this.generateResponse(userMessage, 'conversation', {
          systemPrompt,
          userInfo,
          temperature: options.temperature || 0.7,
          preferredService: 'openrouter'
        });
      } catch (error) {
        console.warn('[AI] OpenRouter conversation failed, falling back to Gemini');
      }
    }
    
    // Fallback to Gemini
    return await this.generateResponse(userMessage, 'conversation', {
      systemPrompt,
      userInfo,
      temperature: options.temperature || 0.7,
      preferredService: 'gemini'
    });
  }

  /**
   * Generate creative content (posts, stories, etc.)
   */
  async generateCreativeContent(
    prompt: string,
    contentType: 'post' | 'diary' | 'analysis' | 'fortune' | 'song',
    userInfo?: UserInfoGemini,
    options: {
      temperature?: number;
      creativity?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<AIResponse> {
    const systemPrompt = this.buildCreativeSystemPrompt(contentType, userInfo);
    
    const temperature = options.creativity === 'high' ? 0.9 
                      : options.creativity === 'low' ? 0.3 
                      : options.temperature || 0.7;
    
    if (USE_OPENROUTER_FOR_GENERATION && this.openRouterClient.isAvailable()) {
      try {
        return await this.generateResponse(prompt, 'generation', {
          systemPrompt,
          userInfo,
          temperature,
          preferredService: 'openrouter'
        });
      } catch (error) {
        console.warn('[AI] OpenRouter generation failed, falling back to Gemini');
      }
    }
    
    // Fallback to Gemini
    return await this.generateResponse(prompt, 'generation', {
      systemPrompt,
      userInfo,
      temperature,
      preferredService: 'gemini'
    });
  }

  /**
   * Analyze text (sentiment, personality, etc.) - fast analysis
   */
  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'personality' | 'topics' | 'mood',
    options: { format?: 'json' | 'text' } = {}
  ): Promise<AIResponse> {
    // Use faster service for analysis
    const preferredService = this.openRouterClient.isAvailable() ? 'openrouter' : 'gemini';
    
    const prompt = this.buildAnalysisPrompt(text, analysisType, options.format);
    
    return await this.generateResponse(prompt, 'analysis', {
      temperature: 0.3, // Low temperature for consistent analysis
      maxTokens: 300,
      preferredService
    });
  }

  /**
   * Generate embeddings (Gemini only - OpenRouter doesn't support embeddings well)
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const model = this.geminiClient.getGenerativeModel({ 
        model: "text-embedding-004" // Updated model name
      });
      
      const embeddings: number[][] = [];
      
      for (const text of texts) {
        const result = await model.embedContent(text);
        embeddings.push(result.embedding.values);
      }
      
      return embeddings;
      
    } catch (error) {
      console.error('[AI] Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Determine which service to use based on request type and preferences
   */
  private determineService(requestType: RequestType, preferredService?: AIServiceType): 'openrouter' | 'gemini' {
    // Embeddings always use Gemini
    if (requestType === 'embedding') {
      return 'gemini';
    }
    
    // Use preferred service if specified and available
    if (preferredService === 'openrouter' && this.openRouterClient.isAvailable()) {
      return 'openrouter';
    }
    
    if (preferredService === 'gemini') {
      return 'gemini';
    }
    
    // Use global preference
    if (AI_SERVICE_PREFERENCE === 'openrouter' && this.openRouterClient.isAvailable()) {
      return 'openrouter';
    }
    
    if (AI_SERVICE_PREFERENCE === 'gemini') {
      return 'gemini';
    }
    
    // Mixed mode - alternate or choose based on request type
    if (AI_SERVICE_PREFERENCE === 'mixed') {
      if (requestType === 'conversation' && USE_OPENROUTER_FOR_CONVERSATION && this.openRouterClient.isAvailable()) {
        return 'openrouter';
      }
      
      if (requestType === 'generation' && USE_OPENROUTER_FOR_GENERATION && this.openRouterClient.isAvailable()) {
        return 'openrouter';
      }
    }
    
    // Default fallback
    return this.openRouterClient.isAvailable() ? 'openrouter' : 'gemini';
  }

  /**
   * Call the specified AI service
   */
  private async callService(
    service: 'openrouter' | 'gemini',
    prompt: string,
    requestType: RequestType,
    options: any
  ): Promise<AIResponse> {
    if (service === 'openrouter') {
      this.requestCounts.openrouter++;
      
      let response: string;
      
      if (requestType === 'analysis') {
        response = await this.openRouterClient.analyzeText(
          prompt, 
          options.analysisType || 'sentiment',
          { format: options.format }
        );
      } else if (options.userInfo) {
        response = await this.openRouterClient.generatePersonalizedResponse(
          prompt,
          this.extractUserContext(options.userInfo),
          requestType === 'conversation' ? 'conversational' : 'affirmative'
        );
      } else {
        response = await this.openRouterClient.generateText([
          ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
          { role: 'user' as const, content: prompt }
        ], {
          temperature: options.temperature,
          max_tokens: options.maxTokens
        });
      }
      
      return {
        text: response,
        service: 'openrouter',
        model: 'openrouter-default',
        responseTime: 0 // Will be set by caller
      };
      
    } else {
      this.requestCounts.gemini++;
      
      const model = this.geminiClient.getGenerativeModel({ 
        model: requestType === 'analysis' ? MODEL_GEMINI_LITE : MODEL_GEMINI,
        systemInstruction: options.systemPrompt || SYSTEM_INSTRUCTION
      });
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return {
        text: response,
        service: 'gemini',
        model: requestType === 'analysis' ? MODEL_GEMINI_LITE : MODEL_GEMINI,
        responseTime: 0 // Will be set by caller
      };
    }
  }

  /**
   * Build system prompt for conversations
   */
  private buildConversationSystemPrompt(userInfo: UserInfoGemini): string {
    let prompt = SYSTEM_INSTRUCTION;
    
    if (userInfo.langStr) {
      prompt += `\n\nUser's preferred language: ${userInfo.langStr}`;
    }
    
    return prompt;
  }

  /**
   * Build system prompt for creative content
   */
  private buildCreativeSystemPrompt(contentType: string, userInfo?: UserInfoGemini): string {
    let prompt = SYSTEM_INSTRUCTION;
    
    const contentPrompts = {
      post: '\n\nGenerate a cheerful, engaging social media post that spreads positivity.',
      diary: '\n\nWrite a diary entry that reflects on the day with gratitude and optimism.',
      analysis: '\n\nProvide a supportive personality analysis that highlights strengths.',
      fortune: '\n\nCreate an encouraging fortune reading that inspires hope.',
      song: '\n\nRecommend a song that matches the mood and explain why it fits.'
    };
    
    prompt += contentPrompts[contentType as keyof typeof contentPrompts] || '';
    
    if (userInfo?.langStr) {
      prompt += `\n\nRespond in: ${userInfo.langStr}`;
    }
    
    return prompt;
  }

  /**
   * Build analysis prompt
   */
  private buildAnalysisPrompt(text: string, analysisType: string, format?: string): string {
    const prompts = {
      sentiment: `Analyze the sentiment of this text on a scale from -100 (very negative) to 100 (very positive). Include the score and a brief explanation.\n\nText: "${text}"`,
      personality: `Analyze the personality traits shown in this text. Consider Big 5 traits and communication style.\n\nText: "${text}"`,
      topics: `Extract the main topics and interests from this text. List as keywords.\n\nText: "${text}"`,
      mood: `Determine the emotional mood: happy, sad, excited, anxious, calm, frustrated, content, or mixed.\n\nText: "${text}"`
    };
    
    let prompt = prompts[analysisType as keyof typeof prompts] || prompts.sentiment;
    
    if (format === 'json') {
      prompt += '\n\nRespond with valid JSON only.';
    }
    
    return prompt;
  }

  /**
   * Extract user context for OpenRouter
   */
  private extractUserContext(userInfo: UserInfoGemini): any {
    return {
      name: userInfo.follower.displayName,
      language: userInfo.langStr,
      // Add more context extraction as needed
    };
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      requestCounts: this.requestCounts,
      openRouterAvailable: this.openRouterClient.isAvailable(),
      openRouterStats: this.openRouterClient.getUsageStats(),
      currentPreference: AI_SERVICE_PREFERENCE,
      fallbackEnabled: OPENROUTER_FALLBACK_TO_GEMINI
    };
  }

  /**
   * Test all services
   */
  async testServices(): Promise<{ openrouter: boolean; gemini: boolean }> {
    const results = {
      openrouter: false,
      gemini: false
    };
    
    // Test OpenRouter
    try {
      results.openrouter = await this.openRouterClient.testConnection();
    } catch (error) {
      console.error('OpenRouter test failed:', error);
    }
    
    // Test Gemini
    try {
      const model = this.geminiClient.getGenerativeModel({ model: MODEL_GEMINI_LITE });
      const result = await model.generateContent('Test');
      results.gemini = !!result.response.text();
    } catch (error) {
      console.error('Gemini test failed:', error);
    }
    
    return results;
  }
}

// Export singleton instance
let aiServiceInstance: AIServiceManager | null = null;

export function getAIServiceManager(): AIServiceManager {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIServiceManager();
  }
  return aiServiceInstance;
}

export default AIServiceManager;