/**
 * Enhanced Bot Integration - Ties together all improvements for English-first, fast, personalized responses
 */

import { CommitCreateEvent } from '@skyware/jetstream';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import { SQLite3 } from '../db/index.js';
import { UserProfilingManager } from '../util/userProfiling.js';
import { ResponseOptimizer } from '../util/responseOptimizer.js';
import { getLangStr } from '../bsky/util.js';
import { postContinuous } from '../bsky/postContinuous.js';

// Enhanced affirmative word collections
import enhancedPositiveEn from '../json/affirmativeword_enhanced_positive_en.json';
import enhancedNormalEn from '../json/affirmativeword_enhanced_normal_en.json';
import enhancedSupportiveEn from '../json/affirmativeword_enhanced_supportive_en.json';

// Fallback to original collections
import positiveEn from '../json/affirmativeword_positive_en.json';
import normalEn from '../json/affirmativeword_normal_en.json';
import negativeEn from '../json/affirmativeword_negative_en.json';
import positiveJp from '../json/affirmativeword_positive.json';
import normalJp from '../json/affirmativeword_normal.json';
import negativeJp from '../json/affirmativeword_negative.json';

export class EnhancedBotCore {
  private userProfiler: UserProfilingManager;
  private responseOptimizer: ResponseOptimizer;
  private db: SQLite3;

  constructor(database: SQLite3) {
    this.db = database;
    this.userProfiler = new UserProfilingManager(database);
    this.responseOptimizer = new ResponseOptimizer(database, this.userProfiler);
  }

  /**
   * Enhanced reply handler - optimized for speed and personalization
   */
  async handleEnhancedReply(
    event: CommitCreateEvent<"app.bsky.feed.post">,
    follower: ProfileView
  ): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const record = event.commit.record as Record;
      const userMessage = record.text;
      const did = follower.did;

      // Step 1: Get or create user profile (parallel with sentiment analysis)
      const [userProfile, sentimentScore] = await Promise.all([
        this.userProfiler.getUserProfile(did),
        this.analyzeSentimentFast(userMessage)
      ]);

      // Step 2: Try to get optimized response first (ultra-fast)
      const optimizedResponse = await this.responseOptimizer.getOptimizedResponse(
        did,
        userMessage,
        userProfile,
        { sentimentScore }
      );

      if (optimizedResponse) {
        // Ultra-fast path: use cached/template response
        await this.sendReply(optimizedResponse, event);
        console.log(`✨ Ultra-fast reply sent in ${Date.now() - startTime}ms`);
        
        // Update user profile in background (don't wait)
        this.updateUserProfileBackground(follower, [userMessage]);
        return true;
      }

      // Step 3: Generate personalized response (fast path)
      const personalizedResponse = await this.generatePersonalizedResponse(
        userMessage,
        userProfile,
        sentimentScore
      );

      if (personalizedResponse) {
        await this.sendReply(personalizedResponse, event);
        console.log(`⚡ Fast personalized reply sent in ${Date.now() - startTime}ms`);
        
        // Update user profile in background
        this.updateUserProfileBackground(follower, [userMessage]);
        return true;
      }

      // Step 4: Fallback to AI generation (slower path)
      console.log(`🤖 Falling back to AI generation after ${Date.now() - startTime}ms`);
      return false; // Let the existing AI system handle it

    } catch (error) {
      console.error('Error in enhanced reply handler:', error);
      
      // Emergency fallback
      const emergencyResponse = this.getEmergencyResponse(follower);
      await this.sendReply(emergencyResponse, event);
      return true;
    }
  }

  /**
   * Fast sentiment analysis without AI
   */
  private async analyzeSentimentFast(text: string): Promise<number> {
    const lowerText = text.toLowerCase();
    
    // Define word sets with weights
    const positiveWords = {
      'amazing': 3, 'awesome': 3, 'fantastic': 3, 'incredible': 3, 'wonderful': 3,
      'great': 2, 'good': 2, 'nice': 2, 'happy': 2, 'love': 2, 'excellent': 2,
      'perfect': 3, 'brilliant': 3, 'outstanding': 3, 'superb': 3, 'marvelous': 3,
      'best': 2, 'better': 1, 'fine': 1, 'okay': 1, 'cool': 1, 'fun': 2,
      'excited': 2, 'thrilled': 3, 'delighted': 2, 'pleased': 2, 'satisfied': 1
    };

    const negativeWords = {
      'terrible': -3, 'awful': -3, 'horrible': -3, 'disgusting': -3, 'hate': -3,
      'bad': -2, 'poor': -2, 'sad': -2, 'angry': -2, 'frustrated': -2, 'upset': -2,
      'disappointed': -2, 'worried': -2, 'anxious': -2, 'stressed': -2, 'tired': -1,
      'bored': -1, 'annoyed': -2, 'irritated': -2, 'confused': -1, 'lost': -1,
      'difficult': -1, 'hard': -1, 'tough': -1, 'challenging': -1, 'struggle': -2
    };

    let score = 0;
    let wordCount = 0;

    // Check positive words
    for (const [word, weight] of Object.entries(positiveWords)) {
      if (lowerText.includes(word)) {
        score += weight;
        wordCount++;
      }
    }

    // Check negative words
    for (const [word, weight] of Object.entries(negativeWords)) {
      if (lowerText.includes(word)) {
        score += weight; // weight is already negative
        wordCount++;
      }
    }

    // Check for emojis
    const positiveEmojis = ['😊', '😄', '😃', '😀', '🙂', '😆', '😂', '🤣', '😍', '🥰', '😘', '🤗', '🎉', '🎊', '✨', '🌟', '💕', '❤️', '💖', '👍', '👏', '🙌'];
    const negativeEmojis = ['😢', '😭', '😞', '😔', '😟', '😰', '😨', '😱', '😤', '😠', '😡', '🤬', '😩', '😫', '😖', '😣', '😵', '🤢', '🤮', '👎'];

    for (const emoji of positiveEmojis) {
      if (text.includes(emoji)) {
        score += 2;
        wordCount++;
      }
    }

    for (const emoji of negativeEmojis) {
      if (text.includes(emoji)) {
        score -= 2;
        wordCount++;
      }
    }

    // Normalize score (-100 to 100)
    if (wordCount === 0) return 0;
    return Math.max(-100, Math.min(100, (score / wordCount) * 25));
  }

  /**
   * Generate personalized response based on user profile and sentiment
   */
  private async generatePersonalizedResponse(
    message: string,
    userProfile: any,
    sentimentScore: number
  ): Promise<string | null> {
    const language = userProfile?.preferredLanguage || 'English';
    
    // Select appropriate response collection based on sentiment and language
    let responseCollection: string[];
    
    if (language === 'English') {
      if (sentimentScore > 30) {
        responseCollection = enhancedPositiveEn;
      } else if (sentimentScore < -20) {
        responseCollection = enhancedSupportiveEn;
      } else {
        responseCollection = enhancedNormalEn;
      }
    } else {
      // Japanese fallback
      if (sentimentScore > 30) {
        responseCollection = positiveJp;
      } else if (sentimentScore < -20) {
        responseCollection = negativeJp;
      } else {
        responseCollection = normalJp;
      }
    }

    // Select response based on user relationship level
    const relationshipLevel = userProfile?.relationshipLevel || 0;
    let responseIndex: number;

    if (relationshipLevel >= 2) {
      // Close friend - use more personal/enthusiastic responses
      responseIndex = Math.floor(Math.random() * Math.min(20, responseCollection.length));
    } else if (relationshipLevel >= 1) {
      // Friend - use middle range responses
      const start = Math.floor(responseCollection.length * 0.2);
      const end = Math.floor(responseCollection.length * 0.8);
      responseIndex = start + Math.floor(Math.random() * (end - start));
    } else {
      // New user - use safe, welcoming responses
      const start = Math.floor(responseCollection.length * 0.3);
      responseIndex = start + Math.floor(Math.random() * Math.min(15, responseCollection.length - start));
    }

    let response = responseCollection[responseIndex];
    
    // Personalize the response
    if (userProfile?.personalContext?.name && relationshipLevel >= 2) {
      response = response.replace(/You're/g, `${userProfile.personalContext.name}, you're`);
    }

    // Adjust emoji density based on user preferences
    if (userProfile?.responsePreferences?.includeEmojis === false) {
      response = response.replace(/[^\w\s!?.,:;'"()-]/g, '');
    }

    // Adjust length based on preferences
    if (userProfile?.responsePreferences?.length === 'short') {
      response = response.split('!')[0] + '!';
    }

    return response;
  }

  /**
   * Send reply to the post
   */
  private async sendReply(response: string, event: CommitCreateEvent<"app.bsky.feed.post">): Promise<void> {
    try {
      const uri = `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`;
      const cid = event.commit.cid;
      
      await postContinuous(response, {
        root: { uri, cid: cid.toString() },
        parent: { uri, cid: cid.toString() }
      });
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }

  /**
   * Update user profile in background (non-blocking)
   */
  private updateUserProfileBackground(follower: ProfileView, posts: string[]): void {
    // Run this in the background without awaiting
    setTimeout(async () => {
      try {
        const profileUpdate = await this.userProfiler.analyzeUserFromInteraction(
          follower,
          posts
        );
        await this.userProfiler.saveUserProfile(profileUpdate);
      } catch (error) {
        console.error('Background profile update error:', error);
      }
    }, 100); // Small delay to not block main thread
  }

  /**
   * Emergency fallback response
   */
  private getEmergencyResponse(follower: ProfileView): string {
    const responses = [
      "You're amazing! ✨",
      "I'm so glad you're here! 🌟",
      "You brighten my day! 😊",
      "Thanks for sharing! 💫",
      "You're the best! 🎉"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      optimizer: this.responseOptimizer.getPerformanceStats(),
      profiler: {
        cacheSize: 'varies',
        analysisSpeed: '< 100ms'
      }
    };
  }

  /**
   * Cleanup old data
   */
  cleanup(): void {
    this.responseOptimizer.cleanupCache();
  }
}

// Export singleton instance
let enhancedBotInstance: EnhancedBotCore | null = null;

export function getEnhancedBot(database: SQLite3): EnhancedBotCore {
  if (!enhancedBotInstance) {
    enhancedBotInstance = new EnhancedBotCore(database);
  }
  return enhancedBotInstance;
}