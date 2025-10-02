# 🤝 Contributing to Enhanced Bluesky Affirmative Bot

Thank you for your interest in contributing! This guide will help you understand the codebase and make meaningful contributions.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Structure](#code-structure)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Familiarity with TypeScript
- Basic understanding of AT Protocol/Bluesky
- Test Bluesky account for development

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/j4ckxyz/frost-bot.git
cd frost-bot

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/frost-bot.git
```

---

## 🛠️ Development Setup

### Quick Setup

```bash
# Install dependencies
npm install

# Create development environment
cp .env.example .env
# Edit .env with your test account credentials

# Run in development mode (auto-restart on changes)
./dev.sh
```

### Manual Setup

```bash
# Install dependencies
npm install

# Create .env file
nano .env

# Add test credentials:
BSKY_IDENTIFIER="your-test-bot.bsky.social"
BSKY_PASSWORD="your-app-password"
GEMINI_API_KEY="your-api-key"
DEVELOPMENT_MODE="true"

# Start development server
npm run start
```

### Testing Your Changes

```bash
# Run service tests
./test-services.sh

# Check TypeScript compilation
npm run build

# Monitor logs
tail -f logs/bot.log
```

---

## 🏗️ Code Structure

### Core Directories

```
src/
├── index.ts              # Main entry point - Bot initialization
├── config/
│   └── index.ts          # Configuration loader and system prompts
├── bsky/                 # Bluesky/AT Protocol integration
│   ├── agent.ts          # Agent initialization with custom PDS support
│   ├── jetstream.ts      # Real-time event stream listener
│   ├── post.ts           # Post creation and reply functions
│   └── follow.ts         # Follow/unfollow logic
├── ai/
│   └── serviceManager.ts # AI service routing (OpenRouter + Gemini)
├── openrouter/
│   └── client.ts         # OpenRouter API client
├── gemini/
│   ├── index.ts          # Gemini API wrapper
│   └── generateAffirmativeWord.ts  # Response generation
├── util/
│   ├── userProfiling.ts  # User personality analysis
│   ├── responseOptimizer.ts  # Response caching system
│   └── enhancedBotCore.ts    # Integration layer
├── db/
│   └── index.ts          # SQLite database schema and operations
└── modes/                # Bot interaction modes
    ├── fortune.ts        # Fortune telling
    ├── conversation.ts   # Conversation mode
    └── analyze.ts        # Personality analysis
```

### Key Components

#### 1. Event Processing Flow

```typescript
// src/index.ts
Jetstream (new posts) 
  → Filter followers only
  → Check user preferences
  → Route to appropriate mode
  → Generate response
  → Send reply
```

#### 2. User Profiling System

```typescript
// src/util/userProfiling.ts
class UserProfilingManager {
  // Analyze user from their posts
  async analyzeUserFromInteraction(did: string, postText: string)
  
  // Get stored profile
  async getUserProfile(did: string): UserProfile
  
  // Update profile
  async saveUserProfile(profile: UserProfile)
}
```

#### 3. Response Optimization

```typescript
// src/util/responseOptimizer.ts
class ResponseOptimizer {
  // Get cached or generate new response
  async getOptimizedResponse(userDid: string, context: string)
  
  // 3-tier caching:
  // 1. Exact match cache (< 5ms)
  // 2. Template responses (< 20ms)
  // 3. AI-generated (< 50ms)
}
```

#### 4. AI Service Manager

```typescript
// src/ai/serviceManager.ts
class AIServiceManager {
  // Route request to appropriate AI service
  async generateResponse(prompt: string, options?: Options)
  
  // Fallback chain: OpenRouter → Gemini
  private async determineService(taskType: string)
}
```

---

## ➕ Adding Features

### Adding a New Response Mode

1. **Create mode file** in `src/modes/`:

```typescript
// src/modes/myNewMode.ts
import { BskyAgent } from '@atproto/api';
import config from '../config/index.js';

export const checkMyNewModeTrigger = (text: string): boolean => {
  const triggers = ['trigger1', 'trigger2'];
  return triggers.some(trigger => 
    text.toLowerCase().includes(trigger)
  );
};

export const handleMyNewMode = async (
  agent: BskyAgent,
  post: any,
  authorDid: string
): Promise<void> => {
  // Your mode logic here
  const response = await generateMyResponse(post);
  
  // Reply to user
  await agent.post({
    text: response,
    reply: {
      root: post.reply?.root || { uri: post.uri, cid: post.cid },
      parent: { uri: post.uri, cid: post.cid }
    }
  });
};

const generateMyResponse = async (post: any): Promise<string> => {
  // Generate response logic
  return "Your response here";
};
```

2. **Register in main handler** (`src/index.ts`):

```typescript
import { checkMyNewModeTrigger, handleMyNewMode } from './modes/myNewMode.js';

// In the main event handler:
if (checkMyNewModeTrigger(postText)) {
  await handleMyNewMode(agent, post, authorDid);
  return;
}
```

3. **Add trigger words to config** (`src/config/index.ts`):

```typescript
export const MYNEWMODE_TRIGGER_WORDS = [
  // English first
  'trigger1', 'trigger2',
  // Japanese
  'トリガー1', 'トリガー2'
];
```

### Adding a New AI Provider

1. **Create client** in `src/yourprovider/`:

```typescript
// src/yourprovider/client.ts
export class YourProviderClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.yourprovider.com';
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, ...options })
    });
    
    const data = await response.json();
    return data.text;
  }
}
```

2. **Add to AI Service Manager** (`src/ai/serviceManager.ts`):

```typescript
import { YourProviderClient } from '../yourprovider/client.js';

class AIServiceManager {
  private yourProviderClient: YourProviderClient | null = null;
  
  constructor() {
    if (process.env.YOURPROVIDER_API_KEY) {
      this.yourProviderClient = new YourProviderClient(
        process.env.YOURPROVIDER_API_KEY
      );
    }
  }
  
  private async determineService(taskType: string): Promise<string> {
    // Add your provider to the routing logic
    if (this.yourProviderClient && config.AI_SERVICE_PREFERENCE === 'yourprovider') {
      return 'yourprovider';
    }
    // ... existing logic
  }
}
```

3. **Update environment variables** and documentation.

### Adding Response Templates

1. **Create JSON file** in `src/json/`:

```json
// src/json/mynewtemplate_en.json
[
  "Template response 1 ✨",
  "Template response 2 🌟",
  "Template response 3 💫"
]
```

2. **Import in response system**:

```typescript
import myNewTemplates from '../json/mynewtemplate_en.json' assert { type: 'json' };

// Use in your mode
const randomTemplate = myNewTemplates[
  Math.floor(Math.random() * myNewTemplates.length)
];
```

### Extending Database Schema

1. **Update schema** in `src/db/index.ts`:

```typescript
const desiredSchemas = {
  followers: `
    CREATE TABLE followers (
      did TEXT PRIMARY KEY,
      handle TEXT,
      // ... existing columns
      new_column TEXT DEFAULT NULL,
      new_timestamp INTEGER DEFAULT NULL
    )
  `
};
```

2. **Add migration logic** if needed:

```typescript
// Check if column exists
const tableInfo = db.prepare(`PRAGMA table_info(followers)`).all();
const hasNewColumn = tableInfo.some(col => col.name === 'new_column');

if (!hasNewColumn) {
  db.exec(`ALTER TABLE followers ADD COLUMN new_column TEXT DEFAULT NULL`);
}
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Start bot in development mode
DEVELOPMENT_MODE=true npm start

# 2. From your test account:
# - Follow the bot
# - Wait for follow-back
# - Post test messages
# - Try different trigger words

# 3. Monitor logs
tail -f logs/bot.log

# 4. Check database
sqlite3 data/bot.db "SELECT * FROM followers WHERE handle='test.bsky.social'"
```

### Service Testing

```bash
# Test all services
./test-services.sh

# Test specific service
node test-services.js openrouter
node test-services.js gemini
node test-services.js pds
```

### Testing Checklist

Before submitting a PR, test:

- ✅ Bot starts without errors
- ✅ Follows back new followers
- ✅ Responds to posts appropriately
- ✅ All trigger words work
- ✅ Database updates correctly
- ✅ No memory leaks (run for 30+ minutes)
- ✅ Error handling works (test with invalid API keys)
- ✅ Performance is acceptable (< 100ms response time)

---

## 📤 Pull Request Process

### Before Submitting

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following code style guidelines

3. **Test thoroughly** using the testing checklist

4. **Update documentation**:
   - Update README.md if adding features
   - Add JSDoc comments to new functions
   - Update CONTRIBUTING.md if changing architecture

5. **Commit with clear messages**:
```bash
git commit -m "feat: Add new fortune telling algorithm"
git commit -m "fix: Resolve memory leak in response cache"
git commit -m "docs: Update configuration examples"
```

### Submitting PR

1. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request** on GitHub with:
   - **Clear title**: "feat: Add weather integration mode"
   - **Description**: What does this PR do and why?
   - **Testing**: How did you test this?
   - **Screenshots**: If UI/output changes, show examples

3. **Wait for review**:
   - Address reviewer feedback
   - Keep PR focused on one feature
   - Be responsive to comments

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 💅 Code Style

### TypeScript Guidelines

```typescript
// ✅ Good: Use types
interface UserProfile {
  did: string;
  handle: string;
  personalityTraits: PersonalityTraits;
}

// ❌ Bad: Avoid 'any'
const data: any = { ... };

// ✅ Good: Explicit return types
async function getProfile(did: string): Promise<UserProfile> {
  // ...
}

// ✅ Good: Use async/await
const result = await fetchData();

// ❌ Bad: Avoid callbacks
fetchData((result) => { ... });

// ✅ Good: Error handling
try {
  const data = await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
  throw new Error('Meaningful error message');
}
```

### Code Organization

```typescript
// Order: imports → interfaces → constants → functions → exports

// 1. Imports (external first, then internal)
import { BskyAgent } from '@atproto/api';
import config from '../config/index.js';

// 2. Interfaces and types
interface MyData {
  field: string;
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Functions (exported last)
const helperFunction = () => { ... };

export const mainFunction = async () => { ... };
```

### Comments

```typescript
// ✅ Good: Explain why, not what
// Cache results for 1 hour to avoid API rate limits
const CACHE_TTL = 3600;

// ❌ Bad: Obvious comments
// Set cache TTL to 3600
const CACHE_TTL = 3600;

// ✅ Good: JSDoc for public functions
/**
 * Analyzes user personality from their post history
 * @param did - User's DID
 * @param postCount - Number of recent posts to analyze (default: 20)
 * @returns Personality analysis with Big Five traits
 */
export async function analyzePersonality(
  did: string, 
  postCount: number = 20
): Promise<PersonalityAnalysis> {
  // ...
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
class UserProfilingManager { }

// Functions: camelCase
async function getUserProfile() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RESPONSE_LENGTH = 280;

// Files: kebab-case
// user-profiling.ts
// response-optimizer.ts
```

---

## 🐛 Common Issues

### TypeScript Errors

```bash
# Clear build cache
rm -rf dist/
npm run build

# Check for type errors
npx tsc --noEmit
```

### Database Issues

```bash
# Reinitialize database
rm data/bot.db
node -e "require('./src/db/index.js').default"
```

### API Rate Limits

- Gemini free tier: 60 requests/minute
- Use OpenRouter for higher throughput
- Implement exponential backoff for retries

---

## 📚 Resources

### Documentation
- [AT Protocol Docs](https://atproto.com/docs)
- [Bluesky API](https://docs.bsky.app/)
- [OpenRouter API](https://openrouter.ai/docs)
- [Gemini API](https://ai.google.dev/docs)

### Community
- [Bluesky Discord](https://discord.gg/bluesky)
- [AT Protocol GitHub](https://github.com/bluesky-social/atproto)

---

## ❓ Questions?

- **Issues**: [GitHub Issues](https://github.com/j4ckxyz/frost-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/j4ckxyz/frost-bot/discussions)

---

**Thank you for contributing! 🙏**
