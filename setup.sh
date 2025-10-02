#!/bin/bash

# 🚀 Enhanced Bluesky Affirmative Bot - Super Quick Setup Script
# This script will get your English-first, super-fast bot running in minutes!

echo "🚀 Setting up your Enhanced Bluecho -e "${BLUE}🔧 Enhanced Features:${NC}"
echo "  ✨ English-first responses (Japanese supported)"
echo "  🧠 User profiling and personalization"
echo "  ⚡ Ultra-fast response optimization (<50ms)"
echo "  💾 Smart caching system"
echo "  🎯 Context-aware personality analysis"
echo "  🔄 Background learning from interactions"
echo "  🌐 Custom AT Protocol PDS support"
echo "  🤖 OpenRouter AI integration (Claude, GPT-4, etc.)"
echo "  🔄 Intelligent AI service fallbacks"firmative Bot..."
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
# Bluesky Credentials
BSKY_IDENTIFIER=your.bot.handle
BSKY_PASSWORD=your-app-password

# AT Protocol PDS Configuration (Optional - for custom PDS)
CUSTOM_PDS_URL=
# Examples:
# CUSTOM_PDS_URL=https://your-pds.example.com
# CUSTOM_PDS_URL=https://pds.your-domain.com

# AI Service Configuration
# Primary AI service: "openrouter" | "gemini" | "mixed"
AI_SERVICE_PREFERENCE=openrouter

# OpenRouter Configuration (Recommended)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_FAST_MODEL=anthropic/claude-3-haiku
OPENROUTER_CREATIVE_MODEL=openai/gpt-4o
OPENROUTER_DAILY_LIMIT=5000
OPENROUTER_FALLBACK_TO_GEMINI=true
OPENROUTER_REFERER=https://github.com/j4ckxyz/frost-bot
OPENROUTER_TITLE=Bluesky Affirmative Bot

# Google Gemini API Key (Fallback + Embeddings)
GEMINI_API_KEY=your-gemini-api-key

# Service Feature Flags
USE_OPENROUTER_FOR_CONVERSATION=true
USE_OPENROUTER_FOR_GENERATION=true

# Environment
NODE_ENV=production

# Database
DB_PATH=./data/bot.db

# Optional: Google Sheets (for analytics)
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=

# Optional: YouTube API (for music recommendations)
YOUTUBE_API_KEY=
EOF
    echo -e "${BLUE}📝 Please edit .env file with your credentials:${NC}"
    echo "   1. Get Bluesky app password from: https://bsky.app/settings/app-passwords"
    echo "   2. Get OpenRouter API key from: https://openrouter.ai/keys"
    echo "   3. Get Gemini API key from: https://aistudio.google.com/app/apikey"
    echo "   4. Update BSKY_IDENTIFIER and BSKY_PASSWORD"
    echo "   5. Update OPENROUTER_API_KEY (recommended)"
    echo "   6. Update GEMINI_API_KEY (fallback + embeddings)"
    echo "   7. Optional: Set CUSTOM_PDS_URL for custom AT Protocol PDS"
    echo ""
    echo -e "${YELLOW}⚠️  Run this script again after updating .env${NC}"
    exit 1
fi

# Check if required env vars are set
source .env
if [ -z "$BSKY_IDENTIFIER" ] || { [ -z "$BSKY_APP_PASSWORD" ] && [ -z "$BSKY_PASSWORD" ]; }; then
    echo -e "${RED}❌ Please set BSKY_IDENTIFIER and BSKY_APP_PASSWORD in .env file${NC}"
    exit 1
fi

if [ "$BSKY_IDENTIFIER" = "your.bot.handle" ] || [ "$BSKY_IDENTIFIER" = "your-handle.bsky.social" ]; then
    echo -e "${RED}❌ Please update .env file with your actual credentials${NC}"
    exit 1
fi

# Check AI service configuration
if [ -z "$OPENROUTER_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ Please set at least one AI service API key (OPENROUTER_API_KEY or GEMINI_API_KEY)${NC}"
    exit 1
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  OpenRouter API key not set - using Gemini only${NC}"
elif [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Gemini API key not set - embeddings will not work${NC}"
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Create data directory
mkdir -p data
echo -e "${GREEN}✅ Data directory created${NC}"

# Build the project
echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
npm run build 2>/dev/null || npx tsc

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Build had some warnings, but continuing...${NC}"
fi

# Check if build succeeded
if [ ! -d "dist" ] && [ ! -f "src/index.js" ]; then
    echo -e "${RED}❌ Build failed. Please check your TypeScript configuration.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Test database connection
echo -e "${YELLOW}🗄️  Initializing database...${NC}"
node -e "
const { initializeDatabases } = require('./dist/db/index.js');
initializeDatabases().then(() => {
  console.log('✅ Database initialized successfully');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});
" 2>/dev/null || echo -e "${YELLOW}⚠️  Database will be initialized on first run${NC}"

# Create quick start scripts
echo -e "${YELLOW}📝 Creating quick start scripts...${NC}"

# Start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Enhanced Bluesky Affirmative Bot..."
node dist/index.js
EOF
chmod +x start.sh

# Development script
cat > dev.sh << 'EOF'
#!/bin/bash
echo "🔧 Starting bot in development mode..."
NODE_ENV=development node dist/index.js
EOF
chmod +x dev.sh

# Test script
cat > test.sh << 'EOF'
#!/bin/bash
echo "🧪 Running bot tests..."
node test-services.js
EOF
chmod +x test.sh

# Service test script
cat > test-services.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing all services (PDS, OpenRouter, Gemini)..."
node test-services.js --verbose
EOF
chmod +x test-services.sh

echo -e "${GREEN}✅ Quick start scripts created${NC}"

# Final instructions
echo ""
echo -e "${GREEN}🎉 Setup Complete! Your Enhanced Bluesky Bot is ready!${NC}"
echo "======================================================"
echo ""
echo -e "${BLUE}🚀 Quick Start Commands:${NC}"
echo "  ./start.sh          - Start the bot"
echo "  ./dev.sh            - Start in development mode"  
echo "  ./test.sh           - Test all services"
echo "  ./test-services.sh  - Detailed service testing"
echo ""
echo -e "${BLUE}📊 Enhanced Features:${NC}"
echo "  ✨ English-first responses (Japanese supported)"
echo "  🧠 User profiling and personalization"
echo "  ⚡ Ultra-fast response optimization (<50ms)"
echo "  💾 Smart caching system"
echo "  🎯 Context-aware personality analysis"
echo "  🔄 Background learning from interactions"
echo ""
echo -e "${BLUE}🔧 Configuration Files:${NC}"
echo "  .env                    - Environment variables"
echo "  src/config/index.ts     - Bot personality and settings"
echo "  src/json/               - Response templates"
echo ""
echo -e "${BLUE}📈 Performance Monitoring:${NC}"
echo "  The bot logs response times and cache hit rates"
echo "  User profiles are automatically built from interactions"
echo "  Responses get faster and more personal over time"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "  • Make sure your Bluesky account follows users for them to get replies"
echo "  • The bot learns from interactions - responses improve over time"
echo "  • User profiles are stored locally in SQLite database"
echo "  • First responses may be slower while building user profiles"
echo ""
echo -e "${GREEN}Ready to start? Run: ./start.sh${NC}"
echo ""
echo -e "${BLUE}Need help? Check the README.md or logs for troubleshooting.${NC}"