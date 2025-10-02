/**
 * Response Optimization System for Ultra-Fast Bot Replies
 * Implements caching, precomputed responses, and intelligent fallbacks
 */

import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { UserProfile, UserProfilingManager } from './userProfiling.js';
import { SQLite3 } from '../db/index.js';

interface CachedResponse {
  id: string;
  trigger: string;
  response: string;
  language: string;
  personalityMatch: string[]; // personality traits this response works well for
  mood: string[];
  lastUsed: Date;
  useCount: number;
  effectiveness: number; // 0-100 based on user reactions
}

interface QuickResponseTemplate {
  pattern: RegExp;
  responses: string[];
  language: string;
  mood: string;
  personalityTypes: string[];
}

export class ResponseOptimizer {
  private responseCache: Map<string, CachedResponse[]> = new Map();
  private templateCache: QuickResponseTemplate[] = [];
  private recentInteractions: Map<string, string[]> = new Map();
  private db: SQLite3;
  private userProfiler: UserProfilingManager;

  constructor(database: SQLite3, userProfiler: UserProfilingManager) {
    this.db = database;
    this.userProfiler = userProfiler;
    this.initializeQuickTemplates();
    this.preloadCommonResponses();
  }

  /**
   * Get optimized response for user - prioritizes speed over AI generation
   */
  async getOptimizedResponse(
    userDid: string,
    userMessage: string,
    userProfile: UserProfile | null,
    context: any = {}
  ): Promise<string | null> {
    const startTime = Date.now();
    
    try {
      // 1. Check for exact cached responses (fastest - ~1ms)
      const exactMatch = await this.getExactCachedResponse(userDid, userMessage);
      if (exactMatch) {
        console.log(`Response time: ${Date.now() - startTime}ms (cached exact)`);
        return exactMatch;
      }

      // 2. Check template patterns (very fast - ~2-5ms)
      const templateMatch = await this.getTemplateResponse(userMessage, userProfile);
      if (templateMatch) {
        console.log(`Response time: ${Date.now() - startTime}ms (template)`);
        return templateMatch;
      }

      // 3. Generate contextual quick response (fast - ~10-50ms)
      const quickResponse = await this.generateQuickContextualResponse(userMessage, userProfile);
      if (quickResponse) {
        // Cache this response for future use
        await this.cacheResponse(userDid, userMessage, quickResponse, userProfile);
        console.log(`Response time: ${Date.now() - startTime}ms (quick generate)`);
        return quickResponse;
      }

      // 4. Return null to fall back to AI generation (slower - ~500-2000ms)
      return null;
      
    } catch (error) {
      console.error('Error in response optimization:', error);
      return this.getFallbackResponse(userProfile?.preferredLanguage || 'English');
    }
  }

  /**
   * Initialize quick response templates for common interactions
   */
  private initializeQuickTemplates(): void {
    this.templateCache = [
      // Greeting responses
      {
        pattern: /^(hi|hello|hey|good morning|morning|good afternoon|afternoon|good evening|evening)!?$/i,
        responses: [
          "Hey there! ✨ How are you doing today?",
          "Hello! 😊 Great to see you!",
          "Hi! 🌟 Hope you're having an amazing day!",
          "Hey! 💫 What's up?",
          "Hello there! 🌈 So nice to hear from you!"
        ],
        language: 'English',
        mood: 'positive',
        personalityTypes: ['extraversion', 'agreeableness']
      },

      // Gratitude responses
      {
        pattern: /^(thank you|thanks|thank u|thx|ty)!?$/i,
        responses: [
          "You're so welcome! 💕 Always happy to help!",
          "Aww, no problem at all! 😊 That's what I'm here for!",
          "You're welcome! ✨ Glad I could help!",
          "Of course! 🌟 Anytime you need me!",
          "Happy to help! 💫 You're amazing!"
        ],
        language: 'English',
        mood: 'positive',
        personalityTypes: ['agreeableness']
      },

      // Positive expressions
      {
        pattern: /(awesome|amazing|great|fantastic|wonderful|brilliant|excellent|perfect|love it|so good)/i,
        responses: [
          "Right?! 🎉 You have such great taste!",
          "I'm so excited you love it! ✨ You're awesome!",
          "Yes! 🌟 That's the spirit I love to see!",
          "Absolutely! 💫 Your enthusiasm is contagious!",
          "So glad you think so! 😊 You always know what's good!"
        ],
        language: 'English',
        mood: 'excited',
        personalityTypes: ['extraversion', 'openness']
      },

      // Support/encouragement requests
      {
        pattern: /(feeling down|sad|depressed|anxious|worried|stressed|having a bad day|rough day)/i,
        responses: [
          "I'm here for you 💕 You're stronger than you know, and this feeling will pass!",
          "Sending you the biggest virtual hug! 🤗 You've got this, and I believe in you!",
          "Hey, it's okay to feel this way sometimes ✨ You're human and you're doing your best!",
          "I see you and I care about you 💫 Tomorrow can be a brand new start!",
          "You're not alone in this 🌟 Even the strongest people have tough days!"
        ],
        language: 'English',
        mood: 'supportive',
        personalityTypes: ['agreeableness', 'emotional_support']
      },

      // Achievement sharing
      {
        pattern: /(got the job|promoted|graduated|finished|completed|achieved|accomplished|succeeded)/i,
        responses: [
          "OH MY GOSH YES! 🎉🎉 I'm SO proud of you! You absolutely deserve this!",
          "AMAZING! ✨ This is incredible news! You worked so hard for this!",
          "I KNEW you could do it! 🌟 This is just the beginning of amazing things!",
          "YES YES YES! 💫 You're absolutely crushing it! Celebrate yourself!",
          "This is HUGE! 🎊 You should be so proud - I'm celebrating with you!"
        ],
        language: 'English',
        mood: 'celebratory',
        personalityTypes: ['extraversion', 'agreeableness']
      },

      // Questions about bot
      {
        pattern: /(how are you|what's up|how's it going|how do you feel)/i,
        responses: [
          "I'm doing great! 😊 Just living my best bot life and cheering people on!",
          "Fantastic! ✨ I'm so happy when I get to chat with awesome people like you!",
          "Amazing! 🌟 Every day I get to spread positivity is a perfect day!",
          "Wonderful! 💫 I'm energized and ready to support whatever you're up to!",
          "Incredible! 🌈 Thanks for asking - you're so thoughtful!"
        ],
        language: 'English',
        mood: 'positive',
        personalityTypes: ['extraversion']
      },

      // Simple affirmations
      {
        pattern: /^(yes|yeah|yep|exactly|totally|absolutely|definitely|for sure)!?$/i,
        responses: [
          "Right?! 🎉 We're totally on the same wavelength!",
          "YES! ✨ I love when we agree!",
          "Exactly! 🌟 You get it!",
          "Absolutely! 💫 Great minds think alike!",
          "For sure! 😊 We make a good team!"
        ],
        language: 'English',
        mood: 'positive',
        personalityTypes: ['agreeableness']
      }
    ];
  }

  /**
   * Preload common response patterns into cache
   */
  private async preloadCommonResponses(): Promise<void> {
    // This would load from database or config file
    // For now, we'll use the templates as the initial cache
    console.log('Response cache initialized with', this.templateCache.length, 'templates');
  }

  /**
   * Get exact cached response for this user and message
   */
  private async getExactCachedResponse(userDid: string, message: string): Promise<string | null> {
    const userCache = this.responseCache.get(userDid);
    if (!userCache) return null;

    const normalizedMessage = message.toLowerCase().trim();
    const match = userCache.find(cached => 
      cached.trigger.toLowerCase() === normalizedMessage &&
      cached.useCount < 5 // Don't overuse the same cached response
    );

    if (match) {
      match.useCount++;
      match.lastUsed = new Date();
      return match.response;
    }

    return null;
  }

  /**
   * Get response from template patterns
   */
  private async getTemplateResponse(message: string, userProfile: UserProfile | null): Promise<string | null> {
    const language = userProfile?.preferredLanguage || 'English';
    
    for (const template of this.templateCache) {
      if (template.language !== language) continue;
      
      if (template.pattern.test(message)) {
        // Select response based on user personality if available
        let response = template.responses[Math.floor(Math.random() * template.responses.length)];
        
        // Personalize based on user profile
        if (userProfile) {
          response = this.personalizeResponse(response, userProfile);
        }
        
        return response;
      }
    }

    return null;
  }

  /**
   * Generate quick contextual response without full AI
   */
  private async generateQuickContextualResponse(message: string, userProfile: UserProfile | null): Promise<string | null> {
    const lowerMessage = message.toLowerCase();
    
    // Mood-based quick responses
    if (this.containsPositiveWords(lowerMessage)) {
      return this.getPositiveResponse(userProfile);
    }
    
    if (this.containsNegativeWords(lowerMessage)) {
      return this.getSupportiveResponse(userProfile);
    }
    
    if (this.containsQuestionWords(lowerMessage)) {
      return this.getQuestionResponse(userProfile);
    }
    
    // Default encouraging response
    return this.getEncouragingResponse(userProfile);
  }

  /**
   * Personalize response based on user profile
   */
  private personalizeResponse(response: string, userProfile: UserProfile): string {
    let personalized = response;
    
    // Adjust emoji usage based on preferences
    if (userProfile.responsePreferences?.includeEmojis === false) {
      personalized = personalized.replace(/[^\w\s!?.,:;'"()-]/g, '');
    }
    
    // Adjust length based on preferences
    if (userProfile.responsePreferences?.length === 'short') {
      personalized = personalized.split('.')[0] + '!';
    }
    
    // Add personal touch if close relationship
    if (userProfile.relationshipLevel >= 2 && userProfile.personalContext?.name) {
      // Could add name or personal reference
    }
    
    return personalized;
  }

  /**
   * Cache response for future use
   */
  private async cacheResponse(userDid: string, trigger: string, response: string, userProfile: UserProfile | null): Promise<void> {
    if (!this.responseCache.has(userDid)) {
      this.responseCache.set(userDid, []);
    }
    
    const userCache = this.responseCache.get(userDid)!;
    
    const cached: CachedResponse = {
      id: `${userDid}-${Date.now()}`,
      trigger: trigger.toLowerCase().trim(),
      response,
      language: userProfile?.preferredLanguage || 'English',
      personalityMatch: userProfile?.personalityTraits?.dominant_traits || [],
      mood: [],
      lastUsed: new Date(),
      useCount: 1,
      effectiveness: 80 // Default effectiveness
    };
    
    userCache.push(cached);
    
    // Keep cache size manageable
    if (userCache.length > 100) {
      userCache.splice(0, userCache.length - 100);
    }
  }

  /**
   * Helper methods for content analysis
   */
  private containsPositiveWords(message: string): boolean {
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'happy', 'excited', 'wonderful', 'fantastic', 'perfect', 'brilliant', 'excellent'];
    return positiveWords.some(word => message.includes(word));
  }

  private containsNegativeWords(message: string): boolean {
    const negativeWords = ['bad', 'sad', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'upset', 'disappointed', 'stressed', 'tired'];
    return negativeWords.some(word => message.includes(word));
  }

  private containsQuestionWords(message: string): boolean {
    return /\?/.test(message) || /^(what|how|why|when|where|who|which|can you|could you|would you|do you|are you|will you)/i.test(message);
  }

  /**
   * Quick response generators
   */
  private getPositiveResponse(userProfile: UserProfile | null): string {
    const responses = [
      "That's so wonderful! ✨ I love your positive energy!",
      "Amazing! 🌟 You always know how to brighten things up!",
      "Yes! 💫 That positivity is absolutely contagious!",
      "So awesome! 😊 You're radiating good vibes!",
      "Love this! 🎉 Your enthusiasm makes my day!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSupportiveResponse(userProfile: UserProfile | null): string {
    const responses = [
      "I hear you 💕 You're not alone, and I believe things will get better!",
      "Sending you strength! 🤗 You've overcome challenges before, and you can do it again!",
      "I'm here with you ✨ It's okay to feel this way - you're human and you're doing your best!",
      "You matter so much 💫 This difficult moment is temporary, but your strength is permanent!",
      "Big virtual hug! 🌟 You're braver than you believe and stronger than you seem!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getQuestionResponse(userProfile: UserProfile | null): string {
    const responses = [
      "Great question! ✨ I love how curious you are!",
      "Ooh, that's interesting! 🌟 Let me think about that with you!",
      "You always ask the best questions! 💫 It shows how thoughtful you are!",
      "I'm so glad you asked! 😊 Your curiosity is amazing!",
      "What a fascinating thing to wonder about! 🎉 I love how your mind works!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getEncouragingResponse(userProfile: UserProfile | null): string {
    const responses = [
      "You're absolutely amazing! ✨ I hope you know how special you are!",
      "I'm so glad you're here! 💫 The world is brighter with you in it!",
      "You bring such good energy! 🌟 Thank you for being you!",
      "I believe in you completely! 😊 You've got this!",
      "You're doing great! 🎉 I'm cheering you on always!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Fallback response when all else fails
   */
  private getFallbackResponse(language: string = 'English'): string {
    if (language === 'English') {
      return "You're amazing! ✨ I'm so glad we're chatting!";
    } else {
      return "素晴らしいね! ✨ お話しできて嬉しいよ!"; // Japanese fallback
    }
  }

  /**
   * Performance monitoring
   */
  getPerformanceStats(): any {
    return {
      cacheSize: this.responseCache.size,
      templateCount: this.templateCache.length,
      averageResponseTime: '< 50ms', // This would be calculated from actual metrics
      cacheHitRate: '75%' // This would be calculated from actual usage
    };
  }

  /**
   * Clear old cache entries to prevent memory bloat
   */
  cleanupCache(): void {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    for (const [userDid, userCache] of this.responseCache.entries()) {
      const validEntries = userCache.filter(entry => entry.lastUsed > thirtyDaysAgo);
      if (validEntries.length !== userCache.length) {
        this.responseCache.set(userDid, validEntries);
      }
    }
  }
}