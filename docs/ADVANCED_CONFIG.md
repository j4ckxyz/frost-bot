## 🔧 Advanced Configuration & Environment Variables

This document lists **all** environment variables and advanced tuning options. For a minimal setup, you only need the 3–4 variables shown in the root `README.md` or the trimmed `.env.example`.

---

## ✅ Minimal Required (Basic Run)
| Variable | Required | Description |
|----------|----------|-------------|
| `BSKY_IDENTIFIER` | ✅ | Your Bluesky handle (e.g. `mybot.bsky.social`) |
| `BSKY_APP_PASSWORD` | ✅ | Bluesky App Password (never your account password) |
| `GEMINI_API_KEY` | ✅ (if using Gemini only) | Google Gemini key (free tier ok) |
| `OPENROUTER_API_KEY` | ❌ (recommended) | Access to Claude / GPT‑4 models |

If you only set `GEMINI_API_KEY`, the bot runs in Gemini mode automatically. If you add `OPENROUTER_API_KEY`, the default preference is `openrouter`.

---

## 🤖 AI / Model Selection
| Variable | Default | Notes |
|----------|---------|-------|
| `AI_SERVICE_PREFERENCE` | `openrouter` | `openrouter` \| `gemini` \| `mixed` |
| `OPENROUTER_API_KEY` | – | Required for any OpenRouter usage |
| `OPENROUTER_MODEL` | `anthropic/claude-3.5-sonnet` | Main model |
| `OPENROUTER_FAST_MODEL` | `anthropic/claude-3-haiku` | Cheap & fast fallback |
| `OPENROUTER_CREATIVE_MODEL` | `openai/gpt-4o` | Longer / creative generations |
| `OPENROUTER_FALLBACK_TO_GEMINI` | `true` | Disable by setting `false` |
| `USE_OPENROUTER_FOR_CONVERSATION` | `true` | Fine‑grained override |
| `USE_OPENROUTER_FOR_GENERATION` | `true` | Fine‑grained override |
| `GEMINI_API_KEY` | – | Needed for Gemini and embeddings |

---

## 🌐 Bluesky / AT Protocol
| Variable | Default | Notes |
|----------|---------|-------|
| `BSKY_IDENTIFIER` | – | Handle or DID | 
| `BSKY_APP_PASSWORD` | – | App password (*canonical*) |
| `BSKY_PASSWORD` | – | Deprecated alias – still supported |
| `BSKY_DID` | (auto) | Optional; derived when omitted |
| `CUSTOM_PDS_URL` | – | Custom PDS; leave unset for auto discovery |
| `DEFAULT_PDS_URL` | `https://bsky.social` | Fallback |

---

## ⚙️ Runtime & Server
| Variable | Default | Notes |
|----------|---------|-------|
| `NODE_ENV` | `production` | `development` enables verbose logs |
| `NODE_PORT` | – | If internal WS/server enabled |
| `JETSTREAM_ENDPOINT` | Bluesky default | Custom Jetstream stream |

---

## 🗄️ Data & Storage
| Variable | Default | Notes |
|----------|---------|-------|
| `SQLITE_DB_FILE` / `DB_PATH` | `./data/bot.db` | Local SQLite file |
| `ENABLE_DB_BACKUP` | `true` | Basic backup toggle |
| `DB_BACKUP_INTERVAL` | `24` | Hours between backups |

---

## 🧪 Behavior & Tuning (Optional)
| Variable | Default | Purpose |
|----------|---------|---------|
| `MAX_RESPONSE_LENGTH` | `280` | Character cap |
| `DEFAULT_REPLY_FREQUENCY` | `30` | % of posts to reply for new users |
| `CACHE_TTL` | `3600` | Seconds response templates cached |
| `MAX_POSTS_PER_MINUTE` | `60` | Global throttle |
| `MAX_REPLIES_PER_USER_HOUR` | `10` | Per-user throttle |
| `USER_REPLY_COOLDOWN` | `300` | Seconds between replies to same user |

---

## 🎚 Feature Flags
| Variable | Default | Enables |
|----------|---------|---------|
| `ENABLE_FORTUNE` | `true` | Daily fortune / biorhythm mode |
| `ENABLE_CONVERSATION` | `true` | Multi-turn conversation |
| `ENABLE_ANALYSIS` | `true` | Personality snapshots |
| `ENABLE_DJ_MODE` | `true` | Music recommendation mode |
| `ENABLE_DIARY` | `true` | Daily summary opt‑in |
| `ENABLE_CHEER` | `true` | Cheer / repost support |

---

## 🎨 Personality & Locale
| Variable | Default | Notes |
|----------|---------|-------|
| `BOT_NAME` | `Affirmative Bot` | System persona label |
| `BOT_PERSONALITY` | `friendly, encouraging, supportive` | Prompt hint |
| `DEFAULT_LANGUAGE` | `en` | `en` or `ja` |
| `ENABLE_MULTILANG` | `true` | Basic multilingual responses |

---

## 🔍 Logging & Diagnostics
| Variable | Default | Notes |
|----------|---------|-------|
| `LOG_LEVEL` | `info` | `error`, `warn`, `info`, `debug` |
| `OPENROUTER_REFERER` | Repo URL | Sent to OpenRouter API |
| `OPENROUTER_TITLE` | Bot name | Display metadata |

---

## 🌐 External Integrations (Optional)
| Variable | Purpose |
|----------|---------|
| `YOUTUBE_API_KEY` | Music / song suggestions |
| `SPREADSHEET_ID` / `GSHEET_ID` | Google Sheets logging |
| `NEGAPOSI_URL` | External sentiment service override |
| `NGROK_FOWARDING_URL` | Voice / speech module |

---

## 🛡️ Privacy & Safety Notes
* All follower / interaction data stays local (SQLite).
* Remove `data/` to purge history.
* Unfollow or block the bot to opt out.

---

## 🏁 Recommended Minimal `.env`
```env
BSKY_IDENTIFIER=your-handle.bsky.social
BSKY_APP_PASSWORD=xxxx-xxxx-xxxx
GEMINI_API_KEY=your-gemini-key
# Optional for better quality/speed:
OPENROUTER_API_KEY=your-openrouter-key
```

Add more only when you need advanced behavior.

---

## ❓ FAQ
**Q: Do I need both Gemini and OpenRouter?**  
No. One key is enough. Add OpenRouter later for better quality.

**Q: Which model should I change first?**  
`OPENROUTER_MODEL` – pick a cheaper model if you hit rate/credit limits.

**Q: Why no reply?**  
Check: mutual follow → logs → API keys → reply frequency.

---

If something here feels too complex, open an issue – we’ll keep simplifying. 💙
