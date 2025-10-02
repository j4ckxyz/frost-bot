# 📤 Publishing Your Fork

This guide will help you publish your enhanced fork to GitHub and make it available to the community.

## 📋 Pre-Publication Checklist

Before publishing, make sure:

- ✅ All sensitive data removed from commits
- ✅ `.env` file is in `.gitignore`
- ✅ API keys removed from code
- ✅ README.md is clear and comprehensive
- ✅ CHANGELOG.md documents all changes
- ✅ License file is present (MIT)
- ✅ Package.json has correct metadata
- ✅ Repository URLs updated (replace YOUR_USERNAME)

---

## 🚀 Step-by-Step Publishing

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `bsky-affirmative-bot`
3. Description: "Enhanced English-first Bluesky bot with ultra-fast responses, deep user profiling, and OpenRouter integration"
4. Choose: **Public**
5. **Don't** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 2: Update Repository URLs

Replace `YOUR_USERNAME` in these files with your actual GitHub username:

**Files to update:**
- `README.md` (multiple locations)
- `CONTRIBUTING.md` (GitHub links)
- `CHANGELOG.md` (repository links)
- `QUICKSTART.md` (clone URL)
- `package.json` (repository, bugs, homepage URLs)

Quick find and replace:
```bash
# Replace YOUR_USERNAME with your actual username
find . -type f \( -name "*.md" -o -name "package.json" \) -exec sed -i 's/YOUR_USERNAME/your-actual-username/g' {} +
```

### Step 3: Initialize Git (if not already)

```bash
# If this is a fresh fork, initialize git
cd bsky-affirmative-bot

# Check if git is already initialized
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit: Enhanced fork with English-first support"
```

### Step 4: Connect to GitHub

```bash
# Add your new GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git

# If you already have a remote named 'origin', rename it first:
git remote rename origin old-origin
git remote add origin https://github.com/YOUR_USERNAME/bsky-affirmative-bot.git
```

### Step 5: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

### Step 6: Configure GitHub Repository

On GitHub, go to your repository settings:

#### Topics (for discoverability)
Add these topics: `bluesky`, `atproto`, `bot`, `ai`, `chatbot`, `openrouter`, `gemini`, `typescript`, `nodejs`

#### About Section
- **Description**: "Enhanced Bluesky bot with ultra-fast responses, deep user profiling, OpenRouter integration, and custom PDS support"
- **Website**: (your bot's Bluesky profile URL if you have one)
- ✅ Check "Issues"
- ✅ Check "Discussions"

#### Issues Template (optional but recommended)

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Report a bug or issue
title: '[BUG] '
labels: bug
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
What you expected to happen.

**Environment:**
- Node.js version:
- OS:
- Bot version:

**Logs**
Relevant log output (remove sensitive data).
```

#### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How did you test these changes?

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No sensitive data in commits
```

---

## 🔗 Linking to Original Repository

### Mark as Fork on GitHub

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. Scroll to **"Danger Zone"** (bottom)
4. Look for "This repository is not a fork"
5. If you want GitHub to recognize it as a fork, contact GitHub Support to link it to `suibari/bsky-affirmative-bot`

**Or simply mention it prominently in your README** (already done!).

### Give Credit to Original Author

Make sure these are visible in your repo:

1. **README.md**: Credits section linking to original
2. **CHANGELOG.md**: Original version history
3. **package.json**: `contributors` field includes original author
4. **GitHub Topics**: Include `fork` tag

---

## 📢 Announcing Your Fork

### On Bluesky

Post about your fork:
```
🤖 Just published an enhanced fork of @suibari-bot's affirmative bot!

✨ New features:
- English-first with ultra-fast responses
- Deep user profiling
- OpenRouter integration (Claude, GPT-4)
- Custom PDS support

Check it out: [your-github-link]

Big thanks to @suibari for the original! 🙏
```

### On GitHub Discussions (Original Repo)

If the original repo has discussions enabled, post there:

**Title**: "Enhanced English-First Fork Available"

**Content**:
```
Hi! I've created an enhanced fork focused on English-first usage with several improvements:

- Ultra-fast response times (<50ms)
- Deep user profiling and personality analysis
- OpenRouter integration for Claude and GPT-4
- Custom AT Protocol PDS support
- Comprehensive English documentation

Repository: https://github.com/YOUR_USERNAME/bsky-affirmative-bot

All credit to @suibari for the excellent original bot. This fork maintains compatibility and adds features for English-speaking users and custom deployments.

Happy to answer questions or accept contributions!
```

---

## 📊 Post-Publication Tasks

### Enable GitHub Features

1. **Actions** (if you add CI/CD later):
   - Go to "Actions" tab
   - Enable workflows

2. **Discussions**:
   - Go to Settings → Features
   - Enable Discussions

3. **Security**:
   - Enable Dependabot alerts
   - Enable secret scanning

### Create First Release

```bash
# Tag your first release
git tag -a v2.0.0 -m "Enhanced fork with English-first support"
git push origin v2.0.0
```

On GitHub:
1. Go to "Releases"
2. Click "Draft a new release"
3. Choose tag: `v2.0.0`
4. Title: "v2.0.0 - Enhanced Fork Release"
5. Description: Copy from CHANGELOG.md
6. Click "Publish release"

### Set Up GitHub Pages (optional)

For documentation hosting:
1. Settings → Pages
2. Source: `main` branch, `/docs` folder (if you add docs)
3. Save

---

## 🔒 Security Best Practices

### Before Publishing

```bash
# Check for accidentally committed secrets
git log --all --full-history -- .env

# Check for API keys in commits
git log --all -p | grep -i "api[_-]key"

# If you find secrets, clean history (CAREFUL!):
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### After Publishing

- Enable 2FA on your GitHub account
- Use bot-specific API keys (not your personal ones)
- Monitor for suspicious activity
- Rotate keys periodically

---

## 📈 Growing Your Fork

### Encourage Contributions

1. Make CONTRIBUTING.md prominent
2. Add "good first issue" labels
3. Respond to issues quickly
4. Accept and review PRs

### Documentation

Keep these updated:
- README.md (features, setup)
- CHANGELOG.md (all changes)
- Wiki (if you create one)

### Community

- Enable Discussions for Q&A
- Create a Discord (optional)
- Post updates on Bluesky
- Write blog posts about features

---

## ✅ Final Checklist

Before announcing your fork publicly:

- [ ] All YOUR_USERNAME placeholders replaced
- [ ] Repository is public on GitHub
- [ ] README.md is clear and accurate
- [ ] CONTRIBUTING.md guides new contributors
- [ ] CHANGELOG.md documents all changes
- [ ] .env.example is complete
- [ ] .gitignore protects sensitive files
- [ ] LICENSE file is present (MIT)
- [ ] No API keys in commit history
- [ ] GitHub topics added
- [ ] First release tagged
- [ ] Issues and Discussions enabled
- [ ] Credit given to original author

---

## 🎉 You're Ready to Publish!

Once you've completed this checklist, your enhanced fork is ready for the community.

**Good luck, and thank you for contributing to open source!** 🚀

---

## 📞 Questions?

If you have questions about publishing:
- GitHub Docs: [Fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- GitHub Docs: [Creating releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
