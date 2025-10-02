# Enhanced Bluesky Affirmative Bot# 🌟 Enhanced Bluesky Affirmative Bot# 全肯定botたん



An intelligent, personalized Bluesky bot that provides ultra-fast, contextual affirmative responses with deep user understanding.



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)> An intelligent, personalized Bluesky bot that provides ultra-fast, contextual affirmative responses with deep user understanding.![bot header](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:qcwhrvzx6wmi5hz775uyi6fh/bafkreic7dxnqovwoytjla37gav4ovphnhmlb3dwqdh3nfsmku4vygxqiia@jpeg)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)



**[日本語版 README](./README_ja.md)** | **[Contributing Guide](./CONTRIBUTING.md)**[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[全肯定botたん](https://bsky.app/profile/suibari-bot.bsky.social) は、フォロワーを全肯定するリプライを送るBluesky botです。



---[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)感情分析および生成AIを活用し、フォロワーを励ますことを目的とします。



## Table of Contents[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)



- [About This Project](#about-this-project)Please refer [English README](./README_en.md) for not Japanese speakers.

- [Key Features](#key-features)

- [Installation](#installation)**[📖 日本語版 README](./README_ja.md)** | **[🤝 Contributing Guide](./CONTRIBUTING.md)**

- [Configuration](#configuration)

- [Usage](#usage)---

- [Architecture](#architecture)

- [Troubleshooting](#troubleshooting)---

- [Contributing](#contributing)

- [License](#license)## 概要



---## 📋 Table of Contents



## About This Projectこのリポジトリには、全肯定botたんのコードと設定ファイルが含まれています。



This is an enhanced fork of [suibari's bsky-affirmative-bot](https://github.com/suibari/bsky-affirmative-bot) with significant improvements:- [What is this?](#-what-is-this)本botは以下の機能を持ちます。



- **English-first design** with maintained Japanese support- [Key Features](#-key-features)

- **Ultra-fast response times** (sub-50ms for cached replies)

- **Deep user profiling** with personality analysis- [Quick Start](#-quick-start)1. **AI生成リプライ**: 生成AI (Google Gemini) を使用し、フォロワーの投稿内容（文章、画像）に応じてリプライします

- **OpenRouter integration** for access to Claude, GPT-4, and 200+ AI models

- **Custom AT Protocol PDS support** for decentralized hosting- [Configuration](#-configuration)2. **定型文リプライ**: 日本語極性辞書を使用し、フォロワーの投稿内容（文章）に感情分析を行い、結果に従って定型文リストからリプライします

- **Intelligent caching** and continuous learning systems

- [Usage](#-usage)3. **占い機能**: ユーザの応答で、占いを行います

The bot follows users back on Bluesky, learns their personality and preferences through interactions, and responds with personalized, encouraging messages tailored to their mood and context.

- [Architecture](#-architecture)4. **リプ頻度調整**: ユーザの応答で、botがリプライする頻度の調整が0~100%で行えます

---

- [Troubleshooting](#-troubleshooting)5. **会話機能**: ユーザの応答で、botと連続した会話を行えます

## Key Features

- [Contributing](#-contributing)6. **分析機能**: ユーザの応答で、ユーザの性格分析を行えます

### Performance and Speed

- **Sub-50ms response times** using three-tier caching system- [Credits](#-credits)7. **応援機能**: ユーザの応答で、宣伝を行えます

- **Exact match cache** for instant responses (under 5ms)

- **Template responses** for common patterns (under 20ms)8. **DJ機能**: ユーザの応答で、botがあなたのために選曲

- **AI-generated contextual replies** with personalization (under 50ms)

- **Smart sentiment analysis** without AI overhead for faster processing---9. **日記機能**: ユーザの応答で、botが日記をつけてくれます



### User Understanding

- **Automatic personality profiling** based on Big Five personality traits

- **Personal context storage** including hobbies, goals, and relationships## 🎯 What is this?また、本botは運営維持費をまかなうために有志によるサブスク制を導入しています。

- **Mood pattern tracking** over time to understand emotional trends

- **Relationship levels** that evolve from stranger (0) to close friend (3)

- **Interaction style adaptation** customized per user

This is an **enhanced fork** of [suibari's bsky-affirmative-bot](https://github.com/suibari/bsky-affirmative-bot) with major improvements:以下に通常フォロワー、サブスクフォロワーの使用できる機能をまとめます。サブスクの詳細は[Pixiv Fanbox](https://suibari.fanbox.cc/posts/10174305)をご覧ください。

### AI Integration

- **OpenRouter support** providing access to Claude 3.5 Sonnet, GPT-4, and 200+ models

- **Google Gemini integration** for embeddings and fallback generation

- **Intelligent service routing** selecting appropriate models based on task complexity- 🌍 **English-first** with multi-language support| サブスク可否       | 定型文リプライ | AI生成リプライ | 占い | リプ頻度調整 | 会話機能 | 分析機能 | 応援機能 | DJ機能 | 日記機能 | 

- **Cost optimization** through automatic model selection

- **Graceful fallback chains** ensuring continuous operation- ⚡ **Ultra-fast responses** (<50ms for cached replies)| ------------------ | -------------- | -------------- | ---- | ------------ | -------- | -------- | -------- | ------ | -------- | 



### Network Flexibility- 🧠 **Deep user profiling** (personality, interests, mood tracking)| 通常フォロワー     | ✓             |                | ✓   | ✓           |          | ✓       |          |        |          | 

- **Custom AT Protocol PDS** connectivity for any AT Protocol server

- **Automatic PDS discovery** from user handles- 🔌 **OpenRouter integration** (Claude, GPT-4, 200+ models)| サブスクフォロワー |                | ✓             | ✓   | ✓           | ✓       | ✓       | ✓       | ✓     | ✓       | 

- **Multi-PDS compatibility** for decentralized network support

- **Robust fallback system** for handling connection issues- 🌐 **Custom AT Protocol PDS** support



### Interaction Modes- 💾 **Intelligent caching** and learning system---

- **Fortune telling mode** with daily readings and biorhythm analysis

- **Conversation mode** for extended chat sessions with memory

- **Analysis mode** providing personality and mood analysis

- **DJ mode** offering music recommendations based on preferencesThe bot follows users back, learns about them through their posts, and responds with personalized, encouraging messages tailored to their personality and current mood.## 使用方法

- **Diary mode** generating automated daily summaries

- **Cheer mode** amplifying user content through reposts1. Blueskyで本botをフォローしてください



------2. 一定時間後、本botがフォローバックし、以降、あなたのポストに反応するようになります



## Installation



### Prerequisites## ✨ Key Features本botのフォロー解除、またはユーザブロックにより、以降、本botはリプライしなくなります。



Before installation, ensure you have:



- **Node.js 18 or higher** - JavaScript runtime environment ([Download](https://nodejs.org/))### 🚀 Ultra-Fast Response Systembotフォロー後に、botがあなたのポストにどう反応するかの処理フローは以下です。

- **npm** - Package manager (included with Node.js)

- **Bluesky account** - Social media account for bot operation- **Sub-50ms response times** using 3-tier caching:

- **App password** - Dedicated password for bot access ([Create](https://bsky.app/settings/app-passwords))

- **Google Gemini API key** - For AI generation and embeddings ([Obtain](https://makersuite.google.com/app/apikey))  1. Exact match cache (< 5ms)![bot処理フロー](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:uixgxpiqf4i63p6rgpu7ytmx/bafkreihxgiteyk25cpv3e7lkdsggntpb3jj6ybha4btq5ykf2fzdyq7j6u@jpeg)

- **OpenRouter API key** (optional) - For enhanced AI model access ([Sign up](https://openrouter.ai/))

  2. Template responses (< 20ms)

### Automated Installation

  3. AI-generated contextual replies (< 50ms)### 占い機能

The automated setup script handles dependency installation, configuration file creation, and environment setup:

- Smart sentiment analysis without AI overhead以下の手順を実施することで、本botが占い結果をリプライします。

```bash

# Clone the repository to your local machine- Performance monitoring and optimization占いは1度行うと数時間行えません。

git clone https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git



# Navigate to the project directory

cd bsky-affirmative-bot### 🧠 Deep User Understanding1. 本botに対しメンションまたはリプライで **"占い"** とポストする



# Make the setup script executable (Unix/Linux/macOS)- **Automatic personality profiling** using Big Five traits2. 本botがあなたに占い結果をリプライします

chmod +x setup.sh

- **Personal context storage** (hobbies, goals, relationships, timezone)

# Run the automated setup script

./setup.sh- **Mood pattern tracking** over time### リプライ頻度調整

```

- **Relationship levels** that evolve (0-3: stranger → close friend)以下の手順を実施することで、そのフォロワーに対してのリプライ頻度を変更します。

**What the setup script does:**

1. Verifies Node.js and npm installation- **Interaction style adaptation** per user

2. Installs all required npm dependencies

3. Creates configuration file (.env) from template1. "使用方法"に従い、本botからフォローされた状態となる

4. Initializes SQLite database with required schema

5. Builds TypeScript source code to JavaScript### 🤖 Advanced AI Integration2. 本botに対しメンションまたはリプライで **"freqN"(Nは0~100の整数)** とポストする

6. Creates convenience scripts (start.sh, dev.sh, test.sh)

7. Validates configuration and reports any issues- **OpenRouter support**: Claude 3.5 Sonnet, GPT-4, and 200+ models3. 本botがあなたに設定完了をリプライします



### Manual Installation- **Google Gemini**: Fallback and embeddings



For manual control over the installation process:- **Intelligent routing**: Fast models for quick replies, creative models for complex tasks### 会話機能



```bash- **Cost optimization**: Automatic model selection based on task type以下の手順を実施することで、そのフォロワーに対して会話を開始します。

# Install all project dependencies from package.json

npm install



# Create environment configuration file from template### 🌐 Multi-Network Support1. "使用方法"に従い、本botからフォローされた状態となる

cp .env.example .env

- **Custom AT Protocol PDS**: Connect to any AT Protocol server2. 自分がスレッド主であるスレッドで、botにリプライする

# Edit configuration file with your credentials

nano .env  # or use your preferred text editor- **Auto-discovery**: Automatically finds PDS from user handles3. 本botがあなたにいいねします



# Initialize database schema and tables- **Fallback system**: Gracefully handles PDS connection issues4. 本botがあなたにリプライします

node -e "require('./src/db').default"

5. 4のリプライに対してあなたがリプライした場合、会話が継続します。3に戻ります

# Compile TypeScript source code to JavaScript

npm run build### 💬 Smart Interaction Modes



# Start the bot in production mode- **Fortune telling**: Daily fortune readings with biorhythm analysis会話機能を説明した画像を以下に掲載します。

npm start

```- **Conversation mode**: Extended chat sessions with memory



**Manual installation steps explained:**- **Analysis mode**: Personality and mood analysis![会話機能説明画像](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:qcwhrvzx6wmi5hz775uyi6fh/bafkreib5x75mtoy7md2eegafwgl6ug4vr23bwy7wyorqrmlwxbyhppzim4@jpeg)

- `npm install` - Downloads and installs all dependencies listed in package.json

- `cp .env.example .env` - Creates your configuration file from the template- **DJ mode**: Music recommendations based on user preferences

- `nano .env` - Opens text editor to add your API keys and credentials

- `node -e "require('./src/db').default"` - Runs database initialization script- **Diary mode**: Automated diary generation from user posts### 分析機能

- `npm run build` - Compiles TypeScript (.ts) files to JavaScript (.js) in dist/ folder

- `npm start` - Launches the bot using the compiled JavaScript files- **Cheer mode**: Amplify user content through reposts以下の手順を実施することで、本botが性格分析結果をリプライします。



---分析機能は1度行うと数日間行えません。



## Configuration### 📊 Analytics & Learning



### Required Settings- Background learning from all interactions1. 本botに対しメンションまたはリプライで **"分析して"** とポストする



Edit your `.env` file with these mandatory configuration values:- Response effectiveness tracking2. 本botがあなたに分析結果を画像付きリプライします



```bash- User preference detection

# Bluesky Account Credentials

BSKY_IDENTIFIER="your-handle.bsky.social"- Continuous improvement without intervention### 応援機能

# Your Bluesky username or handle

# Example: mybot.bsky.social以下の手順を実施することで、本botがあなたのポストをリポストして応援します。



BSKY_PASSWORD="your-app-password"---応援機能は1度行うと数時間行えません。

# App password from Bluesky settings (not your main password)

# Generate at: https://bsky.app/settings/app-passwords



# Google Gemini API Configuration## 🚀 Quick Start1. "使用方法"に従い、本botからフォローされた状態となる

GEMINI_API_KEY="your-gemini-api-key"

# API key for Google Gemini AI service2. **"#全肯定応援団"** とハッシュタグをつけて、応援してほしい内容・画像をポストする（botへのリプライ不要）

# Used for text generation and embeddings

# Free tier: 60 requests per minute### Prerequisites3. 本botが2をリポストし、フォロワー全体向けに宣伝ポストします

```



### Optional Settings

Before you begin, ensure you have:### DJ機能

Enhance functionality with these optional configuration values:

以下の手順を実施することで、本botがあなたの気分にあった曲を選曲します。

```bash

# OpenRouter Integration (Recommended)- **Node.js 18 or higher** ([Download](https://nodejs.org/))DJ機能は1度行うと数分行えません。

OPENROUTER_API_KEY="your-openrouter-key"

# API key for OpenRouter service- **npm** (comes with Node.js)

# Provides access to Claude, GPT-4, and 200+ models

# Obtain from: https://openrouter.ai/keys- **Bluesky account** with app password ([Create one](https://bsky.app/settings/app-passwords))1. 本botに対しメンションまたはリプライで **"DJお願い"** とポストする



OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"- **Google Gemini API key** ([Get free key](https://makersuite.google.com/app/apikey))2. 本botがあなたに曲を紹介します

# Default AI model for general responses

# Options: anthropic/claude-3.5-sonnet, openai/gpt-4-turbo, etc.- **(Optional) OpenRouter API key** ([Sign up](https://openrouter.ai/))



AI_SERVICE_PREFERENCE="openrouter"### 日記機能

# Primary AI service selection

# Options: "openrouter" or "gemini"### Super Quick Setup (Recommended)以下の手順を実施することで、本botがあなたの1日のポストから日記をつけます。

# Determines which service is attempted first

設定後、毎晩1度リプライしてくれます。

# Custom AT Protocol PDS

CUSTOM_PDS_URL="https://your-pds.example.com"```bash

# URL of custom Personal Data Server

# Leave empty to use default Bluesky PDS# 1. Clone this repository1. "使用方法"に従い、本botからフォローされた状態となる

# Enables hosting on alternative AT Protocol servers

git clone https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git2. 本botに対しメンションまたはリプライで **"日記つけて"** とポストする

# Bot Behavior Configuration

BOT_DID="did:plc:your-bot-did"cd bsky-affirmative-bot3. 本botが毎晩あなたに日記を送ります

# Decentralized Identifier for your bot

# Find at: https://plc.directory/your-handle.bsky.social4. 本bot対しメンションまたはリプライで **"日記やめて"** とポストすることで、日記機能を解除できます



DEVELOPMENT_MODE="false"# 2. Run the automated setup script

# Enable development features and verbose logging

# Set to "true" for testing, "false" for productionchmod +x setup.sh---



# Performance Tuning./setup.sh

CACHE_TTL="3600"

# Cache time-to-live in seconds## プライバシーポリシー

# Controls how long responses are cached before regeneration

# 3. Follow the prompts to configure your bot

MAX_RESPONSE_LENGTH="280"

# Maximum character length for bot replies# The script will ask for:### 情報の収集

# Keeps responses within Bluesky's limits

```# - Bluesky username and app password



### Obtaining API Keys# - Google Gemini API key本botは、次の情報を収集し処理します：



#### Bluesky App Password# - OpenRouter API key (optional)

1. Navigate to [Bluesky App Passwords Settings](https://bsky.app/settings/app-passwords)

2. Click "Add App Password" button# - Bot personality settings- **フォロワーの投稿内容**: 投稿内容はリプライを生成する目的でのみ利用され、保存や二次利用はいっさい行いません

3. Enter a descriptive name (e.g., "Affirmative Bot")

4. Copy the generated password immediately (cannot be viewed again)- **ユーザーメタデータ**: ユーザー名やプロフィール情報など、応答を個別化するための最低限のデータにアクセスしますが、これらのデータはいっさい保存されません

5. Paste into `.env` file as `BSKY_PASSWORD`

# 4. Start your bot!

#### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)./start.sh### 情報の利用目的

2. Click "Create API Key" button

3. Select "Create API key in new project" or choose existing project```

4. Copy the generated API key

5. Paste into `.env` file as `GEMINI_API_KEY`本botが収集した情報は、リプライ生成以外の目的では、第三者と共有されません。**ただしAI生成リプライ時には、Google Gemini API利用のため、Google LLCとのデータ通信を行います。**

6. Note: Free tier allows 60 requests per minute

That's it! Your bot is now running and will start responding to followers.

#### OpenRouter API Key (Optional)

1. Create account at [OpenRouter](https://openrouter.ai/)### 年齢制限

2. Navigate to [API Keys page](https://openrouter.ai/keys)

3. Click "Create Key" button### Manual Setup本botのAIを用いた機能はGoogle Gemini APIの利用規約に準拠しており、18歳以上のユーザのみを対象としています。

4. Copy the generated API key

5. Add initial credits (minimum $5 recommended for testing)

6. Paste into `.env` file as `OPENROUTER_API_KEY`

If you prefer manual setup:**18歳未満の方は、AIを用いた機能の利用をお控えください。**

---



## Usage

```bash定型文リプライはAIを使わない機能なので、ご利用いただけます。

### Starting the Bot

# 1. Install dependencies

```bash

# Production mode with optimized performancenpm install### 地域制限

./start.sh

本botのAIを用いた機能はGoogle Gemini APIの利用規約に準拠しており、次の地域ではご利用いただけません：

# Development mode with auto-restart on file changes

./dev.sh# 2. Create configuration file



# Test all services and verify configurationcp .env.example .env- イギリス（UK）

./test-services.sh

```- スイス（Switzerland）



**Command explanations:**# 3. Edit .env with your credentials- 欧州連合加盟国（EU Member States）

- `./start.sh` - Launches bot in production mode using compiled JavaScript

- `./dev.sh` - Starts bot with automatic restart when source files change (useful for development)nano .env  # or use your favorite editor

- `./test-services.sh` - Validates API connections and configuration without starting the bot

**これらの地域にお住まいの方は、AIを用いた機能の利用をお控えください。**

### Testing Bot Functionality

# 4. Initialize the database

1. **Follow your bot** on Bluesky using your test account

2. **Wait for follow-back** (typically occurs within 1-2 minutes)node -e "require('./src/db').default"定型文リプライはAIを使わない機能なので、ご利用いただけます。

3. **Post a message** from your test account

4. **Observe the response** from your bot



**Test different modes:**# 5. Build TypeScript### プライバシーポリシーの変更

- Post `fortune` to receive your daily fortune reading

- Post `analyze me` for personality analysisnpm run buildプライバシーポリシーは適宜更新されることがあります。重大な変更があった場合は、本リポジトリにて通知します。

- Post `conversation` to start an extended chat session

- Post `DJ` for personalized music recommendations



### Monitoring Bot Operation# 6. Start the bot### 問い合わせ



```bashnpm start本ボットまたはプライバシーポリシーに関するお問い合わせは、次の連絡先までお願いします：

# View real-time log output

tail -f logs/bot.log```[すいばり (suibari.com)](https://bsky.app/profile/suibari-com)



# Check total number of followers

sqlite3 data/bot.db "SELECT COUNT(*) FROM followers;"

------

# Monitor response performance

grep "Response time" logs/bot.log



# View recent errors## ⚙️ Configuration## ライセンス

grep "ERROR" logs/bot.log | tail -20

```このプロジェクトはOSSであり、MITライセンスの下で提供されています。詳細は [LICENSE](./LICENSE) ファイルをご覧ください。



**Monitoring explanations:**### Required Environment Variables

- `tail -f logs/bot.log` - Displays newest log entries in real-time as they're written

- `sqlite3` commands - Query the SQLite database for statistics and user data### 引用文献

- `grep` commands - Filter log file for specific patterns or error messages

Edit your `.env` file with these **required** settings:本botは日本語感情分析に東北大学 乾・岡崎研究室の [日本語評価極性辞書](https://www.cl.ecei.tohoku.ac.jp/Open_Resources-Japanese_Sentiment_Polarity_Dictionary.html) を使用しています。

### Stopping the Bot

本botは英語感情分析に東京工業大学 奥村・高村研究室の [単語感情極性対応表](http://www.lr.pi.titech.ac.jp/~takamura/pndic_en.html) を使用しています。

```bash

# Find the running bot process```bash

ps aux | grep "node.*index"

# Bluesky Account (Required)---

# Stop gracefully using process ID

kill <PID>BSKY_IDENTIFIER="your-handle.bsky.social"  # Your Bluesky username



# Force stop if graceful shutdown failsBSKY_PASSWORD="your-app-password"           # App password (not your main password!)## 免責事項

pkill -f "node.*index"

```本botは、すいばり自身の技術スキルアップおよびAT-Protocolの理解のために、個人で開発・運用・管理されています。



**Shutdown explanations:**# Google Gemini API (Required for embeddings)そのため、企業が実施しているような手厚いサポートやアップデートは実施が難しいです。

- `ps aux | grep` - Lists all processes and filters for the bot process

- `kill <PID>` - Sends termination signal allowing graceful shutdownGEMINI_API_KEY="your-gemini-api-key"

- `pkill -f` - Forcefully terminates process if graceful shutdown fails

```本botは正常な稼働に向けて可能な限りの改善・改修の努力をしますが、前提として自己責任でのご利用をお願いいたします。

---

また本botを利用したことによる過失や損害につきまして、開発者は一切の責任を負いません。ご了承ください。

## Architecture

### Optional Environment Variables

### Project Structure

---

```

bsky-affirmative-bot/Enhance your bot with these **optional** settings:

├── src/                      # Source code directory

│   ├── index.ts              # Main application entry point```bash

│   ├── config/               # Configuration management# OpenRouter Integration (Recommended for better AI responses)

│   │   └── index.ts          # Bot settings and system promptsOPENROUTER_API_KEY="your-openrouter-key"

│   ├── bsky/                 # Bluesky/AT Protocol integrationOPENROUTER_MODEL="anthropic/claude-3.5-sonnet"  # Default model

│   │   ├── agent.ts          # AT Protocol agent with custom PDS supportAI_SERVICE_PREFERENCE="openrouter"              # Use OpenRouter first

│   │   ├── jetstream.ts      # Real-time event stream listening

│   │   └── post.ts           # Post creation and reply functionality# Custom AT Protocol PDS

│   ├── ai/                   # AI service management layerCUSTOM_PDS_URL="https://your-pds.example.com"   # For custom PDS hosting

│   │   └── serviceManager.ts # Routes requests between OpenRouter and Gemini

│   ├── openrouter/           # OpenRouter API client# Bot Behavior

│   │   └── client.ts         # Wrapper for 200+ AI modelsBOT_DID="did:plc:your-bot-did"                  # Your bot's DID

│   ├── gemini/               # Google Gemini integrationDEVELOPMENT_MODE="false"                         # Set to "true" for testing

│   │   └── index.ts          # Text generation and embeddings

│   ├── util/                 # Core utility modules# Performance Tuning

│   │   ├── userProfiling.ts  # User personality analysis and storageCACHE_TTL="3600"                                 # Cache lifetime in seconds

│   │   └── responseOptimizer.ts # Multi-tier response caching systemMAX_RESPONSE_LENGTH="280"                        # Maximum reply length

│   ├── db/                   # Database management```

│   │   └── index.ts          # SQLite schema and operations

│   ├── modes/                # Bot interaction modes### Getting API Keys

│   │   ├── fortune.ts        # Fortune telling functionality

│   │   ├── conversation.ts   # Extended conversation handling#### Bluesky App Password

│   │   └── analyze.ts        # Personality analysis1. Go to [Bluesky Settings](https://bsky.app/settings/app-passwords)

│   └── json/                 # Response template collections2. Click "Add App Password"

│       ├── affirmativeword_enhanced_positive_en.json3. Give it a name (e.g., "Affirmative Bot")

│       ├── affirmativeword_enhanced_normal_en.json4. Copy the generated password (you won't see it again!)

│       └── affirmativeword_enhanced_supportive_en.json

├── setup.sh                  # Automated installation script#### Google Gemini API Key

├── start.sh                  # Production startup script1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)

├── dev.sh                    # Development startup script2. Click "Create API Key"

└── test-services.sh          # Service validation script3. Copy your key (free tier: 60 requests/minute)

```

#### OpenRouter API Key (Optional but Recommended)

### System Workflow1. Sign up at [OpenRouter](https://openrouter.ai/)

2. Go to [Keys page](https://openrouter.ai/keys)

1. **Event Monitoring** - Jetstream subscribes to Bluesky firehose for new posts from followers3. Create a new key

2. **User Analysis** - Each interaction updates user personality profile in database4. Add credits ($5 recommended for testing)

3. **Sentiment Detection** - Fast local sentiment analysis determines appropriate response type

4. **Response Generation** - Three-tier system selects response method:---

   - Checks cache for exact match (under 5ms)

   - Attempts template matching (under 20ms)## 📖 Usage

   - Generates AI response with personalization (under 50ms)

5. **Continuous Learning** - Background process updates user profiles and caching strategies### Starting Your Bot



### AI Service Routing```bash

# Production mode

```./start.sh

User Post → Sentiment Analysis → Response Selection

                                        ↓# Development mode (with auto-restart)

                    ┌───────────────────┴────────────────────┐./dev.sh

                    ↓                                        ↓

        OpenRouter (Primary)                    Gemini (Fallback)# Test services (verify configuration)

                    ↓                                        ↓./test-services.sh

        Claude 3.5 Sonnet                      Gemini 1.5 Pro```

        GPT-4 Turbo                            Text Generation

        200+ other models                      Embeddings### Testing Your Bot

                    ↓                                        ↓

                    └───────────────────┬────────────────────┘1. **Follow your bot** on Bluesky

                                        ↓2. **Wait for follow-back** (usually within 1-2 minutes)

                            Personalized Response3. **Post something** and watch for a reply!

                                        ↓4. **Try commands**:

                              Post to Bluesky   - Post "fortune" to get your daily fortune

```   - Post "analyze me" for personality analysis

   - Post "conversation" to start a chat

---   - Post "DJ" for music recommendations



## Troubleshooting### Monitoring Your Bot



### Bot Fails to Start```bash

# View live logs

**Problem:** Error occurs when executing `./start.sh`tail -f logs/bot.log



**Solutions:**# Check database stats

sqlite3 data/bot.db "SELECT COUNT(*) FROM followers;"

```bash

# Verify Node.js version meets requirements (18+)# Monitor performance

node --versiongrep "Response time" logs/bot.log

```

# Remove and reinstall dependencies to resolve corruption

rm -rf node_modules package-lock.json### Stopping Your Bot

npm install

```bash

# Verify environment file contains required variables# Find the process

cat .envps aux | grep "node.*index.ts"



# Run service validation to identify configuration issues# Stop gracefully

./test-services.shkill <PID>

```

# Or force stop

### Bot Does Not Respond to Postspkill -f "node.*index.ts"

```

**Problem:** Bot follows back but does not reply to user posts

---

**Diagnostic Steps:**

## 🏗️ Architecture

1. **Check log files** for errors: `tail -f logs/bot.log`

2. **Verify API credentials** are valid: `./test-services.sh`### Project Structure

3. **Confirm reply frequency** is not set to 0% for user

4. **Ensure mutual follow** relationship exists (bot only replies to followers)```

5. **Check rate limits** have not been exceeded on AI servicesbsky-affirmative-bot/

├── src/

### Slow Response Times│   ├── index.ts              # Main entry point

│   ├── config/               # Configuration management

**Problem:** Bot replies take longer than 1 second│   ├── bsky/                 # Bluesky/AT Protocol integration

│   │   ├── agent.ts          # AT Protocol agent with custom PDS

**Solutions:**│   │   ├── jetstream.ts      # Real-time event streaming

│   │   └── post.ts           # Post creation and replies

```bash│   ├── ai/                   # AI service management

# Enable OpenRouter for faster model access│   │   └── serviceManager.ts # OpenRouter + Gemini routing

echo 'AI_SERVICE_PREFERENCE="openrouter"' >> .env│   ├── openrouter/           # OpenRouter client

│   │   └── client.ts         # API wrapper for 200+ models

# Clear response cache and rebuild│   ├── gemini/               # Google Gemini integration

rm -rf data/cache/*│   │   └── index.ts          # Text generation and embeddings

npm run build│   ├── util/                 # Core utilities

│   │   ├── userProfiling.ts  # Deep user personality analysis

# Check API rate limit status│   │   └── responseOptimizer.ts # Ultra-fast response caching

# Gemini free tier: 60 requests/minute│   ├── db/                   # SQLite database

# OpenRouter: varies by model and credits│   │   └── index.ts          # Schema and operations

```│   ├── modes/                # Bot interaction modes

│   │   ├── fortune.ts        # Fortune telling

**Performance optimization steps:**│   │   ├── conversation.ts   # Extended conversations

- OpenRouter typically provides faster response than Gemini│   │   └── analyze.ts        # Personality analysis

- Cache hits provide sub-50ms responses│   └── json/                 # Response templates

- Verify network connectivity to API endpoints│       ├── affirmativeword_enhanced_positive_en.json

- Monitor API quota usage in respective dashboards│       ├── affirmativeword_enhanced_normal_en.json

│       └── affirmativeword_enhanced_supportive_en.json

### Database Errors├── setup.sh                  # Automated setup script

├── start.sh                  # Production start script

**Problem:** SQLite errors or corrupted database├── dev.sh                    # Development start script

├── test-services.sh          # Service testing script

**Solutions:**└── README.md                 # This file!

```

```bash

# Create backup of current database before modifications### How It Works

cp data/bot.db data/bot.db.backup

1. **Event Stream**: Jetstream monitors Bluesky for new posts from followers

# Reinitialize database (WARNING: deletes all data)2. **User Analysis**: Every interaction updates user personality profiles

rm data/bot.db3. **Sentiment Detection**: Fast sentiment analysis determines response type

node -e "require('./src/db').default"4. **Response Selection**:

   - Check cache for exact match (< 5ms)

# Restore from backup if reinitialization causes issues   - Try template response (< 20ms)

cp data/bot.db.backup data/bot.db   - Generate AI response with personalization (< 50ms)

```5. **Learning**: Background updates to user profiles and caching strategies



**Database troubleshooting notes:**### AI Service Flow

- Database corruption rare but can occur from improper shutdown

- Regular backups recommended for production deployments```

- Reinitializing database preserves no user data or follower relationshipsUser Post → Sentiment Analysis → Response Selection

- Check disk space availability before database operations                                        ↓

                      ┌─────────────────┴──────────────────┐

### API Rate Limit Errors                      ↓                                    ↓

            OpenRouter (Primary)                  Gemini (Fallback)

**Problem:** "Rate limit exceeded" or "429 Too Many Requests" errors                      ↓                                    ↓

            Claude 3.5 Sonnet                    Gemini 1.5 Pro

**Service-Specific Solutions:**            GPT-4 Turbo                          (+ Embeddings)

            200+ other models

**Google Gemini:**                      ↓                                    ↓

- Free tier limitation: 60 requests per minute                      └─────────────────┬──────────────────┘

- Solution: Enable OpenRouter for additional capacity                                        ↓

- Alternative: Implement request queuing to stay within limits                            Personalized Response

```

**OpenRouter:**

- Limits depend on account credits and selected model---

- Solution: Add more credits at [openrouter.ai/credits](https://openrouter.ai/credits)

- Alternative: Switch to faster, less expensive models## 🔧 Troubleshooting



### Custom PDS Connection Issues### Bot Won't Start



**Problem:** Cannot connect to custom AT Protocol PDS**Problem**: Error when running `./start.sh`



**Diagnostic and Solutions:****Solutions**:

```bash

```bash# Check Node.js version (must be 18+)

# Test PDS health endpoint availabilitynode --version

curl https://your-pds.example.com/xrpc/_health

# Reinstall dependencies

# Verify PDS URL format includes protocolrm -rf node_modules package-lock.json

echo $CUSTOM_PDS_URL  # Should start with https://npm install



# Attempt automatic PDS discovery instead# Check environment file

# Remove CUSTOM_PDS_URL from .env to enable auto-discoverycat .env  # Verify all required variables are set

```

# Test services

**PDS connection notes:**./test-services.sh

- Custom PDS must support AT Protocol specification```

- Bot attempts automatic discovery if CUSTOM_PDS_URL not set

- Fallback to default Bluesky PDS occurs on connection failure### No Responses to Posts

- Verify firewall rules allow outbound HTTPS connections

**Problem**: Bot follows back but doesn't reply

---

**Solutions**:

## Contributing1. **Check logs**: `tail -f logs/bot.log`

2. **Verify API keys**: Run `./test-services.sh`

Contributions welcome! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) for:3. **Check reply frequency**: User might have set frequency to 0%

4. **Ensure follow-back**: Bot only replies to followers

- Code structure and organization guidelines

- Instructions for adding new features### Slow Response Times

- Testing procedures and requirements

- Pull request submission process**Problem**: Replies take > 1 second



**Quick contribution checklist:****Solutions**:

- Fork the repository on GitHub```bash

- Create a feature branch from main# Enable OpenRouter for faster responses

- Write clear, descriptive commit messagesecho 'AI_SERVICE_PREFERENCE="openrouter"' >> .env

- Test changes thoroughly before submission

- Update relevant documentation# Clear cache and rebuild

- Submit pull request with detailed descriptionrm -rf data/cache/*

npm run build

---

# Check API rate limits

## License# Gemini: 60 req/min (free)

# OpenRouter: Varies by model

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for complete terms.```



---### Database Errors



## Credits**Problem**: SQLite errors or corrupted data



### Original Project**Solutions**:

Enhanced fork of [suibari/bsky-affirmative-bot](https://github.com/suibari/bsky-affirmative-bot)```bash

- Original Author: [suibari](https://github.com/suibari)# Backup current database

- Original Bot: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)cp data/bot.db data/bot.db.backup



### Enhancement Contributions# Reinitialize (WARNING: Loses data)

- English-first language conversionrm data/bot.db

- User profiling and personality analysis systemsnode -e "require('./src/db').default"

- OpenRouter integration for multi-model AI access

- Custom AT Protocol PDS support# Restore from backup if needed

- Performance optimization and caching layerscp data/bot.db.backup data/bot.db

- Comprehensive English documentation```



### Technology Stack### API Rate Limits

- [AT Protocol](https://atproto.com/) - Decentralized social networking protocol

- [Bluesky](https://bsky.app/) - Social media platform**Problem**: "Rate limit exceeded" errors

- [OpenRouter](https://openrouter.ai/) - Unified AI API gateway

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI generation and embeddings**Solutions**:

- [Node.js](https://nodejs.org/) - JavaScript runtime environment- **Gemini**: Free tier is 60 requests/minute

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript  - Solution: Enable OpenRouter for more capacity

- **OpenRouter**: Depends on credits and model

---  - Solution: Add more credits or switch to faster models



## Support### Custom PDS Connection Issues



- Issues and bug reports: [GitHub Issues](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/issues)**Problem**: Can't connect to custom AT Protocol PDS

- Feature discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/discussions)

- Original bot on Bluesky: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)**Solutions**:

```bash
# Test PDS connection
curl https://your-pds.example.com/xrpc/_health

# Verify PDS URL format (must include https://)
echo $CUSTOM_PDS_URL

# Try auto-discovery instead
# Remove CUSTOM_PDS_URL from .env and let bot discover automatically
```

---

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:

- Code structure and guidelines
- How to add new features
- Testing procedures
- Pull request process

Quick contribution checklist:
- ✅ Fork the repository
- ✅ Create a feature branch
- ✅ Write clear commit messages
- ✅ Test your changes thoroughly
- ✅ Update documentation as needed
- ✅ Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

### Original Project
This is an enhanced fork of [**suibari/bsky-affirmative-bot**](https://github.com/suibari/bsky-affirmative-bot)
- **Original Author**: [suibari](https://github.com/suibari)
- **Original Bot**: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)

### Enhancements
- English-first conversion and user profiling
- OpenRouter integration and multi-model support
- Custom PDS support and performance optimization
- Enhanced documentation and setup experience

### Technologies
- [AT Protocol](https://atproto.com/) - Decentralized social networking
- [Bluesky](https://bsky.app/) - Social media platform
- [OpenRouter](https://openrouter.ai/) - Unified AI API access
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI generation and embeddings
- [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/) - Runtime and language

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/discussions)
- **Original Bot**: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)

---

**Made with 💙 for the Bluesky community**
