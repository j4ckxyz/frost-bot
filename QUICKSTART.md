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


## Quick Start Moved

This guide was merged into `README.md` to keep one source of truth.

Run:
```bash
git clone https://github.com/j4ckxyz/frost-bot
cd frost-bot
cp .env.example .env
nano .env   # fill required vars
npm install && npm run build && npm start
```

Advanced options: `docs/ADVANCED_CONFIG.md`

File retained only to avoid breaking old links.
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
