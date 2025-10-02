# Changelog

All notable changes to this enhanced fork will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-10-02

This is a major enhanced fork of [suibari/frost-bot](https://github.com/suibari/frost-bot) with significant improvements for English-first usage, performance, AI integration, and user experience.

### 🎯 Major Changes

#### Language & Localization
- **BREAKING**: Changed primary language from Japanese to English
- Rewrote all system prompts in natural, conversational English
- Updated trigger words to prioritize English (with Japanese support maintained)
- Added 150+ new English affirmative response templates across 3 sentiment categories
- Created bilingual documentation (English primary, Japanese secondary)

#### AI & Intelligence
- **NEW**: OpenRouter integration for access to Claude 3.5 Sonnet, GPT-4, and 200+ models
- **NEW**: Intelligent AI service routing with fallback chains (OpenRouter → Gemini)
- **NEW**: Model selection based on task type (fast models for quick replies, creative models for complex tasks)
- **NEW**: Deep user profiling with Big Five personality traits
- **NEW**: Automatic personality analysis from user interactions
- **NEW**: Mood pattern tracking and relationship level system
- Retained Google Gemini for embeddings and fallback generation

#### Performance & Caching
- **NEW**: Ultra-fast response system with sub-50ms target
- **NEW**: 3-tier caching architecture:
  - Exact match cache (< 5ms)
  - Template responses (< 20ms)
  - AI-generated contextual replies (< 50ms)
- **NEW**: Response optimizer with intelligent template matching
- **NEW**: Background learning from all interactions

#### Network & Infrastructure
- **NEW**: Custom AT Protocol PDS support for decentralized hosting
- **NEW**: Automatic PDS discovery from user handles
- **NEW**: Graceful fallback to default PDS on connection failures
- Enhanced agent initialization with better error handling

#### User Experience
- **NEW**: Comprehensive user profiling stored in SQLite
- **NEW**: 11 new database columns for personality traits, interests, mood patterns, and personal context
- **NEW**: Relationship levels that evolve from stranger (0) to close friend (3)
- **NEW**: Interaction style adaptation per user
- **NEW**: Timezone and response preference tracking

#### Documentation & Setup
- **NEW**: Beginner-friendly English README with step-by-step guides
- **NEW**: Comprehensive CONTRIBUTING.md for developers
- **NEW**: Detailed .env.example with all configuration options documented
- **NEW**: Automated setup.sh script with validation and colorized output
- **NEW**: Service testing utility (test-services.js)
- **NEW**: Multiple start scripts (start.sh, dev.sh, test.sh)
- Renamed Japanese README to README_ja.md
- Enhanced package.json with proper metadata and keywords

### ✨ Added Features

#### Core Functionality
- User profiling manager (`src/util/userProfiling.ts`)
- Response optimizer (`src/util/responseOptimizer.ts`)
- Enhanced bot core integration layer (`src/util/enhancedBotCore.ts`)
- OpenRouter API client (`src/openrouter/client.ts`)
- AI service manager with routing (`src/ai/serviceManager.ts`)
- Personality analysis generation (`src/gemini/generatePersonalityAnalysis.ts`)

#### Response Templates
- `affirmativeword_enhanced_positive_en.json` - 50 enthusiastic phrases
- `affirmativeword_enhanced_normal_en.json` - 50 encouraging phrases
- `affirmativeword_enhanced_supportive_en.json` - 50 empathetic phrases

#### Configuration Files
- `.env.example` - Comprehensive environment variable template
- `CONTRIBUTING.md` - Developer contribution guide
- `CHANGELOG.md` - This file
- Enhanced `.gitignore` with better security

#### Scripts & Tools
- `test-services.js` - Comprehensive service testing
- `setup.sh` - Automated setup with validation
- Quick start scripts (start.sh, dev.sh, test.sh, test-services.sh)

### 🔄 Changed

#### Configuration
- System instruction rewritten in English with friendly personality
- Trigger word arrays now prioritize English
- Default language changed from Japanese to English
- Added extensive OpenRouter configuration options
- Added custom PDS configuration
- Added AI service preference settings

#### Database Schema
Extended `followers` table with:
- `preferred_language` (default: 'English')
- `personality_traits` (JSON: Big Five traits)
- `interests` (JSON: hobbies, topics)
- `mood_patterns` (JSON: sentiment tracking)
- `interaction_style` (string: formal/casual/etc)
- `timezone` (string: user timezone)
- `response_preferences` (JSON: emoji, length, etc)
- `personal_context` (JSON: goals, relationships, etc)
- `relationship_level` (0-3: stranger to close friend)
- `total_interactions` (integer: interaction count)
- `last_personality_update` (timestamp)

#### AT Protocol Integration
- Modified `src/bsky/agent.ts` for custom PDS support
- Added PDS auto-discovery function
- Enhanced error handling for PDS connections
- Updated language detection to default English

### 🛠️ Fixed

- Improved error handling throughout codebase
- Better validation in setup process
- More robust database initialization
- Enhanced logging for debugging

### 🗑️ Deprecated

- None in this release

### 🔒 Security

- Enhanced .gitignore to prevent credential leaks
- Better environment variable validation
- Secure API key handling with fallbacks
- Added .env.example instead of committing actual .env

### 📚 Documentation

- Created comprehensive English README (primary)
- Maintained Japanese README as README_ja.md (secondary)
- Added detailed CONTRIBUTING.md for developers
- Documented all environment variables in .env.example
- Added inline code comments and JSDoc
- Created troubleshooting section in README
- Added architecture overview

### 🎯 Migration Guide (from v1.0.0)

If you're upgrading from the original bot:

1. **Backup your data**:
   ```bash
   cp data/bot.db data/bot.db.backup
   ```

2. **Update dependencies**:
   ```bash
   npm install
   ```

3. **Update database schema** (automatic on first run):
   - The bot will automatically add new columns to existing database
   - User data and follower relationships are preserved

4. **Update .env file** with new variables:
   ```bash
   # Add OpenRouter support
   OPENROUTER_API_KEY=your-key-here
   AI_SERVICE_PREFERENCE=openrouter
   
   # Optional: Custom PDS
   CUSTOM_PDS_URL=https://your-pds.example.com
   ```

5. **Review trigger words**:
   - English trigger words now take priority
   - Japanese triggers still work
   - Update your documentation if needed

6. **Test the bot**:
   ```bash
   ./test-services.sh
   ./start.sh
   ```

### 🙏 Credits

- **Original Bot**: [suibari/frost-bot](https://github.com/suibari/frost-bot) by [suibari](https://github.com/suibari)
- **Enhanced Fork**: Community contributions for English-first usage, performance optimization, and modern AI integration

---

## [1.0.0] - Original Release

The original Japanese-focused Bluesky affirmative bot by suibari with:
- Japanese-first responses
- Google Gemini integration
- Fortune telling mode
- Conversation mode
- Analysis mode
- DJ mode
- Diary mode
- Template-based responses
- Subscription system support

See the [original repository](https://github.com/suibari/frost-bot) for full details.

---

## Links

- **Original Repository**: https://github.com/suibari/frost-bot
- **Enhanced Fork**: https://github.com/j4ckxyz/frost-bot
- **Issues**: https://github.com/j4ckxyz/frost-bot/issues
- **Original Bot on Bluesky**: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)
