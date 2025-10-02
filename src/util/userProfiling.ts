import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { SQLite3 } from '../db/index.js';
import { UserInfoGemini } from '../types.js';
import { generatePersonalityAnalysis } from '../gemini/generatePersonalityAnalysis.js';

// Enhanced user profile interface
export interface UserProfile {
  did: string;
  preferredLanguage: string;
  personalityTraits: PersonalityTraits | null;
  interests: string[] | null;
  moodPatterns: MoodPattern[] | null;
  interactionStyle: 'casual' | 'formal' | 'friendly' | 'professional' | null;
  timezone: string;
  responsePreferences: ResponsePreferences | null;
  personalContext: PersonalContext | null;
  relationshipLevel: 0 | 1 | 2 | 3; // 0=new, 1=acquaintance, 2=friend, 3=close friend
  totalInteractions: number;
  lastPersonalityUpdate: Date | null;
}

export interface PersonalityTraits {
  openness: number;        // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  dominant_traits: string[];
  communication_style: string;
  emotional_state: 'positive' | 'neutral' | 'negative' | 'mixed';
}

export interface MoodPattern {
  date: string;
  mood: 'positive' | 'neutral' | 'negative' | 'excited' | 'sad' | 'anxious' | 'calm';
  confidence: number; // 0-100
  triggers?: string[]; // what caused this mood
}

export interface ResponsePreferences {
  length: 'short' | 'medium' | 'long';
  tone: 'encouraging' | 'casual' | 'informative' | 'playful';
  includeEmojis: boolean;
  includeQuestions: boolean;
  personalReferences: boolean; // whether they like when bot remembers details
}

export interface PersonalContext {
  name?: string;
  location?: string;
  occupation?: string;
  hobbies?: string[];
  relationships?: string[]; // family, friends, pets mentioned
  goals?: string[];
  challenges?: string[];
  favoriteTopics?: string[];
  importantDates?: { date: string; event: string }[];
  personalityNotes?: string; // freeform notes about personality
}

export class UserProfilingManager {
  private db: SQLite3;
  private analysisCache: Map<string, UserProfile> = new Map();

  constructor(database: SQLite3) {
    this.db = database;
  }

  /**
   * Analyze and extract user information from their posts and interactions
   */
  async analyzeUserFromInteraction(
    follower: ProfileView, 
    posts: string[], 
    previousHistory?: any[]
  ): Promise<Partial<UserProfile>> {
    const did = follower.did;
    
    // Get existing profile
    const existingProfile = await this.getUserProfile(did);
    
    // Analyze current interaction
    const analysis = await this.extractInsightsFromPosts(posts, follower);
    
    // Update mood patterns
    const moodPattern: MoodPattern = {
      date: new Date().toISOString(),
      mood: analysis.detectedMood,
      confidence: analysis.moodConfidence,
      triggers: analysis.moodTriggers
    };

    // Merge with existing data
    const updatedProfile: Partial<UserProfile> = {
      did,
      preferredLanguage: analysis.detectedLanguage || existingProfile?.preferredLanguage || 'English',
      personalityTraits: this.mergePersonalityTraits(existingProfile?.personalityTraits, analysis.personalityUpdate),
      interests: this.mergeInterests(existingProfile?.interests, analysis.detectedInterests),
      moodPatterns: this.updateMoodPatterns(existingProfile?.moodPatterns, moodPattern),
      interactionStyle: analysis.interactionStyle || existingProfile?.interactionStyle,
      personalContext: this.mergePersonalContext(existingProfile?.personalContext, analysis.personalContext),
      relationshipLevel: this.calculateRelationshipLevel(existingProfile?.totalInteractions || 0),
      totalInteractions: (existingProfile?.totalInteractions || 0) + 1,
      lastPersonalityUpdate: new Date()
    };

    // Cache the updated profile
    this.analysisCache.set(did, { ...existingProfile, ...updatedProfile } as UserProfile);
    
    return updatedProfile;
  }

  /**
   * Extract insights from user posts using AI analysis
   */
  private async extractInsightsFromPosts(posts: string[], follower: ProfileView) {
    // Create a comprehensive analysis prompt
    const analysisPrompt = `
    Analyze the following posts from user "${follower.displayName}" and extract:
    1. Detected mood (positive/negative/neutral/excited/sad/anxious/calm)
    2. Mood confidence (0-100)
    3. Possible mood triggers
    4. Detected interests/hobbies
    5. Interaction style (casual/formal/friendly/professional)
    6. Preferred language (if clear from posts)
    7. Personal context clues (name, location, occupation, relationships, goals, challenges)
    8. Personality trait updates (brief notes on openness, extraversion, etc.)

    Posts: ${posts.join(' | ')}

    Return as JSON with keys: detectedMood, moodConfidence, moodTriggers, detectedInterests, interactionStyle, detectedLanguage, personalContext, personalityUpdate
    `;

    try {
      // This would use your existing Gemini integration
      // For now, return a basic analysis structure
      return {
        detectedMood: this.basicMoodAnalysis(posts.join(' ')),
        moodConfidence: 75,
        moodTriggers: [],
        detectedInterests: this.extractBasicInterests(posts.join(' ')),
        interactionStyle: 'casual' as const,
        detectedLanguage: 'English',
        personalContext: {},
        personalityUpdate: {}
      };
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return {
        detectedMood: 'neutral' as const,
        moodConfidence: 50,
        moodTriggers: [],
        detectedInterests: [],
        interactionStyle: 'casual' as const,
        detectedLanguage: 'English',
        personalContext: {},
        personalityUpdate: {}
      };
    }
  }

  /**
   * Basic mood analysis as fallback
   */
  private basicMoodAnalysis(text: string): MoodPattern['mood'] {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['happy', 'great', 'awesome', 'love', 'excited', 'wonderful', 'amazing', '😊', '😄', '🎉'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'tired', 'worried', 'upset', 'disappointed', '😢', '😞', '😤'];
    const excitedWords = ['wow', 'omg', 'incredible', 'fantastic', 'unbelievable', '!!!', '🤩', '😍'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const excitedCount = excitedWords.filter(word => lowerText.includes(word)).length;
    
    if (excitedCount > 0) return 'excited';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract basic interests from text
   */
  private extractBasicInterests(text: string): string[] {
    const lowerText = text.toLowerCase();
    const interests: string[] = [];
    
    const interestKeywords = {
      'gaming': ['game', 'gaming', 'play', 'console', 'pc gaming'],
      'music': ['music', 'song', 'band', 'concert', 'album'],
      'anime': ['anime', 'manga', 'otaku'],
      'movies': ['movie', 'film', 'cinema', 'actor'],
      'books': ['book', 'reading', 'novel', 'author'],
      'sports': ['sport', 'football', 'basketball', 'tennis', 'gym'],
      'programming': ['code', 'programming', 'developer', 'software'],
      'art': ['art', 'drawing', 'painting', 'design'],
      'cooking': ['cooking', 'recipe', 'food', 'chef'],
      'travel': ['travel', 'vacation', 'trip', 'country']
    };
    
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        interests.push(interest);
      }
    }
    
    return interests;
  }

  /**
   * Get user profile from database or cache
   */
  async getUserProfile(did: string): Promise<UserProfile | null> {
    // Check cache first
    if (this.analysisCache.has(did)) {
      return this.analysisCache.get(did)!;
    }

    // Get from database
    return new Promise((resolve) => {
      this.db.getFollower(did, (row) => {
        if (row) {
          const profile: UserProfile = {
            did: row.did,
            preferredLanguage: row.preferred_language || 'English',
            personalityTraits: row.personality_traits ? JSON.parse(row.personality_traits) : null,
            interests: row.interests ? JSON.parse(row.interests) : null,
            moodPatterns: row.mood_patterns ? JSON.parse(row.mood_patterns) : null,
            interactionStyle: row.interaction_style,
            timezone: row.timezone || 'UTC',
            responsePreferences: row.response_preferences ? JSON.parse(row.response_preferences) : null,
            personalContext: row.personal_context ? JSON.parse(row.personal_context) : null,
            relationshipLevel: row.relationship_level || 0,
            totalInteractions: row.total_interactions || 0,
            lastPersonalityUpdate: row.last_personality_update ? new Date(row.last_personality_update) : null
          };
          
          this.analysisCache.set(did, profile);
          resolve(profile);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Save user profile to database
   */
  async saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!profile.did) return;

    const updateData: any = {};
    
    if (profile.preferredLanguage) updateData.preferred_language = profile.preferredLanguage;
    if (profile.personalityTraits) updateData.personality_traits = JSON.stringify(profile.personalityTraits);
    if (profile.interests) updateData.interests = JSON.stringify(profile.interests);
    if (profile.moodPatterns) updateData.mood_patterns = JSON.stringify(profile.moodPatterns);
    if (profile.interactionStyle) updateData.interaction_style = profile.interactionStyle;
    if (profile.timezone) updateData.timezone = profile.timezone;
    if (profile.responsePreferences) updateData.response_preferences = JSON.stringify(profile.responsePreferences);
    if (profile.personalContext) updateData.personal_context = JSON.stringify(profile.personalContext);
    if (profile.relationshipLevel !== undefined) updateData.relationship_level = profile.relationshipLevel;
    if (profile.totalInteractions !== undefined) updateData.total_interactions = profile.totalInteractions;
    if (profile.lastPersonalityUpdate) updateData.last_personality_update = profile.lastPersonalityUpdate.toISOString();

    // Update the follower record
    this.db.updateFollower(profile.did, updateData);
    
    // Update cache
    if (this.analysisCache.has(profile.did)) {
      const existing = this.analysisCache.get(profile.did)!;
      this.analysisCache.set(profile.did, { ...existing, ...profile });
    }
  }

  /**
   * Generate personalized response context for AI
   */
  generatePersonalizedContext(profile: UserProfile | null, currentPosts: string[]): string {
    if (!profile) return '';

    let context = `Personal context for ${profile.did}:\n`;
    
    if (profile.preferredLanguage) {
      context += `- Preferred language: ${profile.preferredLanguage}\n`;
    }
    
    if (profile.personalityTraits) {
      context += `- Personality: ${profile.personalityTraits.dominant_traits?.join(', ') || 'friendly'}\n`;
      context += `- Communication style: ${profile.personalityTraits.communication_style || 'casual'}\n`;
    }
    
    if (profile.interests && profile.interests.length > 0) {
      context += `- Interests: ${profile.interests.join(', ')}\n`;
    }
    
    if (profile.personalContext?.hobbies && profile.personalContext.hobbies.length > 0) {
      context += `- Hobbies: ${profile.personalContext.hobbies.join(', ')}\n`;
    }
    
    if (profile.personalContext?.favoriteTopics && profile.personalContext.favoriteTopics.length > 0) {
      context += `- Favorite topics: ${profile.personalContext.favoriteTopics.join(', ')}\n`;
    }
    
    if (profile.moodPatterns && profile.moodPatterns.length > 0) {
      const recentMood = profile.moodPatterns[profile.moodPatterns.length - 1];
      context += `- Recent mood: ${recentMood.mood}\n`;
    }
    
    if (profile.relationshipLevel > 0) {
      const relationshipLevels = ['new user', 'acquaintance', 'friend', 'close friend'];
      context += `- Relationship level: ${relationshipLevels[profile.relationshipLevel]}\n`;
    }
    
    if (profile.personalContext?.personalityNotes) {
      context += `- Notes: ${profile.personalContext.personalityNotes}\n`;
    }

    return context;
  }

  // Helper methods for merging data
  private mergePersonalityTraits(existing: PersonalityTraits | null, update: any): PersonalityTraits | null {
    if (!update && !existing) return null;
    if (!existing) return update;
    if (!update) return existing;
    
    return { ...existing, ...update };
  }

  private mergeInterests(existing: string[] | null, newInterests: string[]): string[] | null {
    if (!newInterests?.length && !existing?.length) return null;
    if (!existing) return newInterests;
    if (!newInterests) return existing;
    
    const combined = [...existing, ...newInterests];
    return [...new Set(combined)]; // Remove duplicates
  }

  private updateMoodPatterns(existing: MoodPattern[] | null, newPattern: MoodPattern): MoodPattern[] {
    const patterns = existing || [];
    patterns.push(newPattern);
    
    // Keep only last 50 mood patterns to avoid excessive data
    return patterns.slice(-50);
  }

  private mergePersonalContext(existing: PersonalContext | null, update: any): PersonalContext | null {
    if (!update && !existing) return null;
    if (!existing) return update;
    if (!update) return existing;
    
    return { ...existing, ...update };
  }

  private calculateRelationshipLevel(totalInteractions: number): 0 | 1 | 2 | 3 {
    if (totalInteractions < 3) return 0;      // new user
    if (totalInteractions < 10) return 1;     // acquaintance  
    if (totalInteractions < 25) return 2;     // friend
    return 3;                                 // close friend
  }
}