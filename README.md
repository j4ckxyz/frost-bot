# 🌟 Bluesky Affirmative Bot

Fast, lightweight Bluesky bot that sends short, positive, personalized replies to followers. Forked & simplified for **easy setup**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

**日本語版 → [README_ja.md](./README_ja.md)** • **Contributing → [CONTRIBUTING.md](./CONTRIBUTING.md)** • **Advanced config → `docs/ADVANCED_CONFIG.md`**

---

## 🚀 1. 90‑Second Quick Start
```bash
git clone https://github.com/j4ckxyz/frost-bot
cd frost-bot
cp .env.example .env
nano .env   # fill 3 lines (see below)
npm install
npm run build
npm start
```
You only need: Bluesky handle + app password + one AI key (Gemini OR OpenRouter).

Minimal `.env` (copied from example):
```env
BSKY_IDENTIFIER=your-handle.bsky.social
BSKY_APP_PASSWORD=xxxx-xxxx-xxxx
GEMINI_API_KEY=your-gemini-key
# (Optional) OPENROUTER_API_KEY=your-openrouter-key
```
Want better models? Add `OPENROUTER_API_KEY` later – no other changes needed.

---

## ✨ 2. Core Features (Plain English)
| Area | What You Get |
|------|--------------|
| Speed | Sub‑50ms cached replies, falls back to AI when needed |
| AI | OpenRouter (Claude / GPT‑4) + Gemini fallback |
| Personalization | Lightweight user sentiment + simple memory |
| Modes | fortune · converse · analyze · diary · DJ · cheer |
| Safety | Local SQLite only; unfollow/block to opt out |
| Setup | 3 env vars to start; advanced optional |

More toggles & advanced knobs live in `docs/ADVANCED_CONFIG.md`.

---

## 🧪 3. Test It
1. From another account follow the bot.
2. Wait ~1 min for follow‑back.
3. Post: “hello” → bot replies.
4. Try commands: `fortune`, `analyze me`, `conversation`, `DJ`.

---

## 🧵 4. Common Triggers
| Contains | Result |
|----------|--------|
| `fortune` | Daily fortune style reply |
| `analyze me` | Simple personality snapshot |
| `conversation` | Starts casual thread |
| `DJ` | Music / song suggestion |
| `diaryつけて` / `diaryやめて` | Opt‑in / opt‑out daily diary |
| `freqN` (`freq0`..`freq100`) | Adjust reply frequency |
| `#全肯定応援団` | Cheer / repost mode |

No command? It still sends an affirming/supportive reply based on sentiment.

---

## 🔐 5. Environment Variable Cheat Sheet (Mini)
| Required First Run | Optional Later |
|--------------------|----------------|
| `BSKY_IDENTIFIER` | `OPENROUTER_API_KEY` |
| `BSKY_APP_PASSWORD` | `AI_SERVICE_PREFERENCE` |
| `GEMINI_API_KEY` OR `OPENROUTER_API_KEY` | `CUSTOM_PDS_URL` |

Full table → `docs/ADVANCED_CONFIG.md`.

---

## 🛠 6. Commands
| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Build | `npm run build` |
| Start | `npm start` |
| Dev (if script) | `./dev.sh` |
| Service test | `./test-services.sh` |
| Logs | `tail -f logs/bot.log` |

---

## 🩺 7. Quick Troubleshooting
| Symptom | Fix Fast |
|---------|----------|
| No replies | Mutual follow? Check logs. Keys set? |
| Slow (>1s) | Add OpenRouter key or check rate limits |
| Crash at start | Node >=18 & run `npm install` |
| DB issues | Delete `data/bot.db` (loses history) |

More detail → `docs/ADVANCED_CONFIG.md`.

---

## 🗄 8. Data & Privacy
Local SQLite only. Remove `data/` to wipe. No external storage beyond AI API calls.

---

## 🤝 9. Contributing
PRs welcome. See `CONTRIBUTING.md`.

---

## 📄 10. License & Credit
MIT. Original concept by [suibari](https://github.com/suibari). This fork focuses on simplicity + multi‑AI + caching.

---

Need advanced tuning? Open `docs/ADVANCED_CONFIG.md`.

Happy hacking 💙

A fast, English‑first Bluesky bot that sends short, positive, personalized replies to people who follow it. Forked from the original Japanese project and simplified.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

**日本語版 README → [README_ja.md](./README_ja.md)** • **Contributing → [CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 1. What It Does (TL;DR)
Follow the bot → it follows back → it watches your posts → it replies (cached template, or AI if needed) with an affirming, mood‑aware, low‑latency message. Extra trigger words unlock: fortune, analysis, diary, DJ/music, conversation, cheer/repost.

---

## 2. Core Features
| Area | Feature |
|------|---------|
| Speed | Multi‑tier cache (<5ms exact / <20ms template / <50ms AI) |
| AI | OpenRouter (Claude/GPT-4/etc) + Gemini fallback |
| Personalization | Lightweight profiling (sentiment + simple preference memory) |
| Modes | fortune / analyze / conversation / diary / DJ / cheer |
| Deployment | Works with default Bluesky PDS or custom PDS |
| Safety | Local SQLite, minimal stored data, easy opt‑out (unfollow/block) |

---

## 3. Quick Start (90 Seconds)
```bash
git clone https://github.com/j4ckxyz/frost-bot
cd frost-bot
cp .env.example .env   # (if example exists – otherwise create .env manually)
npm install
nano .env              # add required keys below
npm run build
npm start              # or: ./start.sh (if provided)
```
You must create a Bluesky App Password: https://bsky.app/settings/app-passwords

Verify it runs: watch logs (if present) `tail -f logs/bot.log` then from another account follow the bot and post something.

---

## 4. Minimum Environment Variables
Put these in `.env` (names must match code; some original names kept for compatibility):
```
# Bluesky credentials
BSKY_IDENTIFIER=your-handle.bsky.social
BSKY_APP_PASSWORD=app-password-here   # NOTE: code uses BSKY_APP_PASSWORD (not BSKY_PASSWORD)
BSKY_DID=did:plc:xxxxxxxxxxxxxxxxxxxx # (optional; auto derivation if omitted in some flows)

# AI (pick at least one)
GEMINI_API_KEY=xxxxx                  # Required for Gemini fallback & embeddings
OPENROUTER_API_KEY=xxxxx              # Recommended for Claude/GPT‑4
AI_SERVICE_PREFERENCE=openrouter      # openrouter | gemini | mixed

# Optional tuning
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
CUSTOM_PDS_URL=https://your-pds.example.com   # optional
NODE_ENV=production
```
If you only want free usage: supply only `GEMINI_API_KEY` and set `AI_SERVICE_PREFERENCE=gemini`.

---

## 5. Common User Triggers
| Trigger (post/reply contains) | Action |
|-------------------------------|--------|
| fortune                      | Daily fortune / biorhythm style reply |
| analyze me / 分析して          | Simple personality snapshot |
| conversation                 | Starts light conversation thread |
| DJ / DJお願い                 | Music suggestion |
| diaryつけて / diaryやめて      | Opt‑in / opt‑out daily summary |
| freqN (freq0..freq100)       | Adjust reply frequency |
| #全肯定応援団                | Cheer / repost mode |

Normal posts (no command) get an affirmative or supportive reply depending on sentiment & relationship score.

---

## 6. Updating / Running
| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Build | `npm run build` |
| Start (prod) | `npm start` or `./start.sh` |
| Dev (watch) | `./dev.sh` (if script exists) |
| Service test | `./test-services.sh` (if provided) |

Logs (if directory exists): `tail -f logs/bot.log`

---

## 7. Troubleshooting (Fast)
| Symptom | Try |
|---------|-----|
| Bot never replies | Confirm follow-back; check `BSKY_IDENTIFIER` / App Password; view logs |
| Slow replies (>1s) | Add OpenRouter key; ensure cache not being cleared repeatedly |
| 429 / rate limit | Reduce commands; enable OpenRouter or mixed mode |
| DB errors | Remove `data/bot.db` (will lose history) then re-run start/build |
| Crash on start | Node >=18? Missing env vars? Run `npm install` again |

---

## 8. Data & Privacy (Brief)
Stores minimal interaction + lightweight profile info locally (SQLite). No resale / external sharing beyond AI API calls. Unfollow or block = no further replies; remove local DB to purge.

---

## 9. Contributing
PRs welcome. See `CONTRIBUTING.md` for code style & structure.

---

## 10. License & Credit
MIT License (see `LICENSE`).
Original project by [suibari](https://github.com/suibari). This fork: English-first simplification + multi‑model AI & caching improvements.

---

## 11. Quick Env Key Reference (Extended)
Additional optional keys discovered in code (set only if you need them):
```
OPENROUTER_FAST_MODEL=anthropic/claude-3-haiku
OPENROUTER_CREATIVE_MODEL=openai/gpt-4o
OPENROUTER_FALLBACK_TO_GEMINI=true
USE_OPENROUTER_FOR_CONVERSATION=true
USE_OPENROUTER_FOR_GENERATION=true
CUSTOM_PDS_URL=...
NEGAPOSI_URL=...                 # External sentiment service (optional)
SQLITE_DB_FILE=./data/bot.db
YOUTUBE_API_KEY=...              # If using YouTube features
SPREADSHEET_ID=...               # If using gsheet integration
URL_JETSTREAM=wss://...          # Custom Jetstream endpoint
NODE_PORT=3000                   # If running internal server
NGROK_FOWARDING_URL=...          # Voice / speech module
```
Most users only need the minimal set in Section 4.

---

Happy hacking.
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

5. **Check rate limits** have not been exceeded on AI servicesfrost-bot/

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

Enhanced fork of [suibari/frost-bot](https://github.com/suibari/frost-bot)```bash

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



- Issues and bug reports: [GitHub Issues](https://github.com/j4ckxyz/frost-bot/issues)**Problem**: Can't connect to custom AT Protocol PDS

- Feature discussions: [GitHub Discussions](https://github.com/j4ckxyz/frost-bot/discussions)

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
This is an enhanced fork of [**suibari/frost-bot**](https://github.com/suibari/frost-bot)
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

- **Issues**: [GitHub Issues](https://github.com/j4ckxyz/frost-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/j4ckxyz/frost-bot/discussions)
- **Original Bot**: [@suibari-bot.bsky.social](https://bsky.app/profile/suibari-bot.bsky.social)

---

**Made with 💙 for the Bluesky community**
