# 🌟 Enhanced Bluesky Affirmative Bot

An intelligent, English-first Bluesky bot that provides personalized, ultra-fast affirmative responses with deep user understanding.

![Bot Preview](img/bot-tan.png)

## ✨ Enhanced Features

### 🚀 **Ultra-Fast Responses**
- **Sub-50ms response times** using intelligent caching
- Template-based quick responses for common interactions
- Smart fallback system for complex queries
- Performance monitoring and optimization

### 🧠 **Deep User Understanding**
- **Automatic personality profiling** from interactions
- **Personal context storage** (interests, hobbies, mood patterns)
- **Relationship-aware responses** that evolve over time
- **Multi-language support** with English-first approach

### 💬 **Enhanced Response System**
- **3-tier response collections**: positive, supportive, and normal
- **Contextual sentiment analysis** without AI overhead
- **Personalized response selection** based on user relationship
- **Emoji and length preferences** per user

### 🌐 **Custom AT Protocol PDS Support**
- **Auto-discovery** of PDS from user handles
- **Custom PDS endpoint** configuration
- **Fallback to default PDS** if custom fails
- **Multi-PDS compatibility** for decentralized networks

### 🤖 **Advanced AI Integration**
- **OpenRouter support** for Claude, GPT-4, and other models
- **Intelligent service fallbacks** between OpenRouter and Gemini
- **Cost optimization** with model selection based on task type
- **Embedding support** with Gemini for semantic operations

### 📊 **Smart Analytics**
- User interaction tracking and analysis
- Response effectiveness monitoring
- Performance metrics and caching statistics
- Background learning from all interactions

## 🎯 Key Improvements Over Original

| Feature | Original | Enhanced |
|---------|----------|----------|
| **Language** | Japanese-first | **English-first** with Japanese support |
| **Response Time** | 500-2000ms | **<50ms** for cached responses |
| **User Memory** | Basic frequency settings | **Deep personality profiles** |
| **Personalization** | Generic responses | **Contextual & relationship-aware** |
| **Learning** | Static | **Continuous background learning** |
| **Caching** | None | **Multi-level intelligent caching** |
| **PDS Support** | Bluesky only | **Custom AT Protocol PDS support** |
| **AI Services** | Gemini only | **OpenRouter + Gemini with fallbacks** |
| **Models** | Single model | **Multiple models (Claude, GPT-4, etc.)** |

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Bluesky account with app password
- Google Gemini API key

### Super Quick Start
```bash
# Clone and setup everything automatically
git clone https://github.com/your-repo/bsky-affirmative-bot
cd bsky-affirmative-bot
./setup.sh
```

The setup script will:
1. ✅ Install all dependencies
2. ✅ Create configuration files
3. ✅ Initialize the database
4. ✅ Create start scripts
5. ✅ Verify everything is working

### Manual Setup
If you prefer manual setup:

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Build the project
npm run build

# Start the bot
npm start
```

### Required Environment Variables
```env
# Bluesky Account (get app password from bsky.app/settings/app-passwords)
BSKY_IDENTIFIER=your.bot.handle
BSKY_PASSWORD=your-app-password

# AT Protocol PDS (optional - for custom PDS)
CUSTOM_PDS_URL=https://your-pds.example.com

# AI Services (at least one required)
# OpenRouter (recommended - supports Claude, GPT-4, etc.)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Google Gemini (fallback + embeddings)
GEMINI_API_KEY=your-gemini-api-key

# AI Service Configuration
AI_SERVICE_PREFERENCE=openrouter  # "openrouter" | "gemini" | "mixed"
OPENROUTER_FALLBACK_TO_GEMINI=true

# Environment
NODE_ENV=production
```

## 💡 Usage Examples

### Basic Interactions
```
User: "Hello!"
Bot: "Hey there! ✨ How are you doing today?"

User: "I'm feeling great!"
Bot: "That's so wonderful! ✨ I love your positive energy!"

User: "Having a rough day..."
Bot: "I hear you 💕 You're not alone, and I believe things will get better!"
```

### Custom PDS Support
```bash
# Connect to your own AT Protocol PDS
CUSTOM_PDS_URL=https://your-pds.example.com

# Or let the bot auto-discover your PDS
BSKY_IDENTIFIER=your.handle.your-pds.com
```

### AI Service Selection
```bash
# Use OpenRouter for everything (recommended)
AI_SERVICE_PREFERENCE=openrouter
OPENROUTER_API_KEY=your-key

# Use mixed mode - OpenRouter for conversations, Gemini for analysis
AI_SERVICE_PREFERENCE=mixed
USE_OPENROUTER_FOR_CONVERSATION=true
USE_OPENROUTER_FOR_GENERATION=false

# Gemini only mode
AI_SERVICE_PREFERENCE=gemini
```

### Personalized Over Time
```
First interaction:
User: "Good morning"
Bot: "Good morning! 😊 Great to meet you!"

After building relationship:
User: "Good morning"
Bot: "Morning, Sarah! 🌟 Hope your art project is going amazing today!"
```

## 🔧 Configuration

### Bot Personality
Customize the bot's personality in `src/config/index.ts`:
- Character traits and speaking style
- Interests and favorite topics
- Response preferences and behaviors

### Response Collections
Add or modify responses in `src/json/`:
- `affirmativeword_enhanced_positive_en.json` - Enthusiastic responses
- `affirmativeword_enhanced_normal_en.json` - Encouraging responses  
- `affirmativeword_enhanced_supportive_en.json` - Supportive responses

### User Profiling
User profiles are automatically built and include:
- **Personality traits** (Big 5 + communication style)
- **Interests and hobbies** detected from posts
- **Mood patterns** over time
- **Response preferences** (length, emoji usage, etc.)
- **Personal context** (name, relationships, goals)
- **Relationship level** (new user → close friend)

## 📊 Performance Monitoring

The bot provides real-time performance metrics:

```javascript
// Get performance stats
const stats = enhancedBot.getPerformanceStats();
console.log(stats);
// Output:
// {
//   optimizer: {
//     cacheSize: 1250,
//     templateCount: 50,
//     averageResponseTime: '45ms',
//     cacheHitRate: '78%'
//   },
//   profiler: {
//     analysisSpeed: '< 100ms'
//   }
// }
```

## 🛡️ Privacy & Data

- **All user data stored locally** in SQLite database
- **No external data sharing** beyond required API calls
- **Automatic data cleanup** removes old interaction data
- **Opt-out friendly** - users can block/unfollow anytime

## 🔍 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Jetstream     │────│  Enhanced Bot    │────│  Response       │
│   (Bluesky)     │    │  Core            │    │  Optimizer      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                       ┌──────────────────┐    ┌─────────────────┐
                       │  User Profiling  │────│  SQLite         │
                       │  Manager         │    │  Database       │
                       └──────────────────┘    └─────────────────┘
```

### Component Breakdown

1. **Enhanced Bot Core** - Main orchestrator
2. **Response Optimizer** - Ultra-fast response selection
3. **User Profiling Manager** - Personality analysis and storage
4. **SQLite Database** - Local data persistence
5. **Jetstream Integration** - Real-time Bluesky events

## 🚀 Advanced Features

### Smart Caching System
- **Exact match cache** for repeated queries
- **Template pattern matching** for common interactions
- **Context-aware generation** for new scenarios
- **Automatic cache cleanup** to prevent memory bloat

### Personality Analysis
- **Real-time sentiment analysis** without AI overhead
- **Big 5 personality trait detection** from interactions
- **Communication style adaptation** per user
- **Mood pattern tracking** over time

### Response Optimization
- **Multi-tier response selection** based on user data
- **Relationship-aware personalization** 
- **Performance-first design** with AI fallback
- **Continuous learning** from user reactions

## 🔧 Development

### Project Structure
```
src/
├── config/           # Bot configuration and personality
├── db/              # Database schema and operations
├── gemini/          # AI integration (fallback)
├── json/            # Response templates and data
├── util/            # Enhanced utilities
│   ├── userProfiling.ts
│   ├── responseOptimizer.ts
│   └── enhancedBotCore.ts
├── bsky/            # Bluesky API integration
└── tests/           # Testing utilities
```

### Adding New Response Types
1. Create JSON file in `src/json/`
2. Import in `enhancedBotCore.ts`  
3. Add logic in `generatePersonalizedResponse()`
4. Test with `./test.sh`

### Custom User Profiling
Extend the `UserProfile` interface in `src/util/userProfiling.ts`:

```typescript
export interface UserProfile {
  // ... existing fields
  customField: string;
  yourAnalysis: CustomAnalysis;
}
```

## 📈 Performance Tips

1. **Use caching** - Let the system build response caches
2. **Monitor metrics** - Check performance stats regularly  
3. **Clean database** - Run cleanup periodically
4. **Optimize responses** - Remove unused response templates
5. **Profile regularly** - User profiles improve response quality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Japanese bot by suibari
- Bluesky community for API support
- Google Gemini for AI capabilities
- Contributors and testers

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 **Email**: your-email@example.com

---

**Ready to spread positivity at lightning speed?** 🚀

Run `./setup.sh` and let your enhanced bot start making everyone's day better!