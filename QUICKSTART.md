# 🚀 Quick Start Guide

**Get your Enhanced Bluesky Affirmative Bot running in 10 minutes!**

This guide assumes you're starting from scratch. If you're technical, see [README.md](./README.md) for more details.

---

## ⚡ Super Quick Setup (5 Steps)

### Step 1: Install Node.js

**Already have Node.js?** Skip to Step 2.

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (left green button)
3. Install it (just click "Next" through the installer)
4. Verify installation:
   ```bash
   node --version
   # Should show: v18.x.x or higher
   ```

### Step 2: Get Your API Keys

You need these keys to run the bot:

#### 2a. Bluesky App Password (Required)

1. Go to [bsky.app/settings/app-passwords](https://bsky.app/settings/app-passwords)
2. Click **"Add App Password"**
3. Name it: "Affirmative Bot"
4. **Copy the password** (you won't see it again!)
5. Save it somewhere safe

#### 2b. Google Gemini API Key (Required)

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Choose "Create API key in new project"
4. **Copy the key**
5. Save it somewhere safe

#### 2c. OpenRouter API Key (Optional but Recommended)

This gives you access to Claude and GPT-4 (better responses!):

1. Go to [openrouter.ai](https://openrouter.ai/)
2. Click **"Sign In"** (can use Google/GitHub)
3. Go to [Keys page](https://openrouter.ai/keys)
4. Click **"Create Key"**
5. **Copy the key**
6. Add $5 credits at [openrouter.ai/credits](https://openrouter.ai/credits)

### Step 3: Download and Setup

```bash
# Download the code
git clone https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git
cd bsky-affirmative-bot

# Run the automatic setup
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Install everything needed
- ✅ Create a configuration file
- ✅ Ask you to add your API keys

### Step 4: Configure Your Bot

The setup script created a file called `.env`. Edit it:

```bash
nano .env
# Or use any text editor you like
```

**Required settings** (fill these in):

```bash
# Your Bluesky username
BSKY_IDENTIFIER="your-handle.bsky.social"

# The app password you created in Step 2a
BSKY_PASSWORD="your-app-password-here"

# The Gemini API key from Step 2b
GEMINI_API_KEY="your-gemini-key-here"
```

**Optional but recommended** (better responses):

```bash
# The OpenRouter API key from Step 2c
OPENROUTER_API_KEY="your-openrouter-key-here"
AI_SERVICE_PREFERENCE="openrouter"
```

Save the file:
- In nano: Press `Ctrl+X`, then `Y`, then `Enter`
- In other editors: Just save normally

### Step 5: Start Your Bot!

```bash
./start.sh
```

You should see:
```
🚀 Starting Enhanced Bluesky Affirmative Bot...
✅ Connected to Bluesky
✅ Database initialized
✅ Listening for posts...
```

**That's it! Your bot is running!** 🎉

---

## 🧪 Testing Your Bot

### Quick Test

1. **From another account**, follow your bot on Bluesky
2. Wait 1-2 minutes for the bot to follow you back
3. Post something like "Hello!" or "Having a great day!"
4. Watch for a reply! ✨

### Try Different Features

Once you're following each other, try posting:

- `"fortune"` - Get your daily fortune
- `"conversation"` - Start a chat with the bot
- `"analyze me"` - Get personality analysis
- `"DJ"` - Get music recommendations

---

## 📊 Monitoring Your Bot

### View Live Activity

Open a new terminal and run:

```bash
# Watch logs in real-time
tail -f logs/bot.log
```

You'll see:
- New followers
- Posts being processed
- Responses being sent
- Any errors (if they happen)

### Check Statistics

```bash
# How many followers?
sqlite3 data/bot.db "SELECT COUNT(*) FROM followers;"

# Who are they?
sqlite3 data/bot.db "SELECT handle FROM followers LIMIT 10;"
```

---

## 🛑 Stopping Your Bot

In the terminal where the bot is running:

1. Press `Ctrl+C`
2. Wait for "Shutting down..." message
3. Done!

Or from another terminal:

```bash
# Find the process
ps aux | grep "node.*index"

# Stop it (replace PID with the number you see)
kill PID
```

---

## 🔧 Common Issues

### "Command not found: npm"

**Problem**: Node.js not installed properly

**Solution**:
```bash
# Check Node.js is installed
node --version

# If not found, reinstall Node.js from nodejs.org
```

### "Error: Invalid credentials"

**Problem**: Wrong Bluesky username or password

**Solution**:
1. Check `.env` file has correct `BSKY_IDENTIFIER`
2. Make sure you're using an **app password**, not your main password
3. Create a new app password if needed

### "Error: API key invalid"

**Problem**: Wrong or expired API key

**Solution**:
1. Check `.env` file has correct keys
2. Create new API keys if needed
3. Make sure no extra spaces in the `.env` file

### Bot not responding to posts

**Problem**: Several possible causes

**Solutions**:
1. Make sure the bot followed you back (check on Bluesky)
2. Wait 1-2 minutes after following for the system to sync
3. Check logs: `tail -f logs/bot.log`
4. Verify API keys are working: `./test-services.sh`

### "Port already in use"

**Problem**: Bot is already running

**Solution**:
```bash
# Find and stop the existing bot
ps aux | grep "node.*index"
kill PID
# Then start again
./start.sh
```

---

## 🎯 Next Steps

Now that your bot is running:

1. **Customize responses**: Edit files in `src/json/` folder
2. **Adjust personality**: Edit `src/config/index.ts`
3. **Read full docs**: Check [README.md](./README.md)
4. **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📞 Need Help?

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/bsky-affirmative-bot/discussions)
- **Documentation**: [README.md](./README.md)

---

**Happy botting! 🎉**
