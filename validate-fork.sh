#!/bin/bash

# 🔍 Pre-Publication Validation Script
# This script checks if your fork is ready to be published

echo "🔍 Validating your Enhanced Bluesky Bot fork..."
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check for placeholder text
check_placeholder() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${YELLOW}⚠️${NC}  $3"
        WARNINGS=$((WARNINGS + 1))
        return 1
    else
        echo -e "${GREEN}✅${NC} $3"
        return 0
    fi
}

# Function to check for sensitive data
check_sensitive() {
    if grep -qiE "api[_-]?key.*=[\"']?[a-zA-Z0-9]{20,}" "$1" 2>/dev/null; then
        echo -e "${RED}❌${NC} $2 - FOUND POTENTIAL API KEY!"
        ERRORS=$((ERRORS + 1))
        return 1
    else
        echo -e "${GREEN}✅${NC} $2"
        return 0
    fi
}

echo -e "${BLUE}📚 Checking Documentation...${NC}"
check_file "README.md" "Main README exists"
check_file "README_ja.md" "Japanese README exists"
check_file "QUICKSTART.md" "Quick start guide exists"
check_file "CONTRIBUTING.md" "Contributing guide exists"
check_file "CHANGELOG.md" "Changelog exists"
check_file "LICENSE" "License file exists"
echo ""

echo -e "${BLUE}⚙️  Checking Configuration Files...${NC}"
check_file ".env.example" "Environment template exists"
check_file "package.json" "Package.json exists"
check_file ".gitignore" ".gitignore exists"
check_file "setup.sh" "Setup script exists"

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️${NC}  .env file exists (should NOT be committed)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo -e "${BLUE}🤝 Checking GitHub Templates...${NC}"
check_file ".github/ISSUE_TEMPLATE/bug_report.md" "Bug report template exists"
check_file ".github/ISSUE_TEMPLATE/feature_request.md" "Feature request template exists"
check_file ".github/ISSUE_TEMPLATE/question.md" "Question template exists"
check_file ".github/PULL_REQUEST_TEMPLATE.md" "PR template exists"
echo ""

echo -e "${BLUE}🔎 Checking for Placeholders...${NC}"
check_placeholder "README.md" "YOUR_USERNAME" "README has no YOUR_USERNAME placeholder"
check_placeholder "package.json" "YOUR_USERNAME" "package.json has no YOUR_USERNAME placeholder"
check_placeholder "CONTRIBUTING.md" "YOUR_USERNAME" "CONTRIBUTING.md has no YOUR_USERNAME placeholder"
check_placeholder "QUICKSTART.md" "YOUR_USERNAME" "QUICKSTART.md has no YOUR_USERNAME placeholder"
echo ""

echo -e "${BLUE}🔒 Checking for Sensitive Data...${NC}"
check_sensitive "README.md" "README has no API keys"
check_sensitive "package.json" "package.json has no API keys"

# Check git history for .env
if git log --all --full-history -- .env 2>/dev/null | grep -q "commit"; then
    echo -e "${RED}❌${NC} .env file found in git history!"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅${NC} No .env in git history"
fi

# Check if .env is in .gitignore
if grep -q "^\.env" .gitignore; then
    echo -e "${GREEN}✅${NC} .env is in .gitignore"
else
    echo -e "${RED}❌${NC} .env is NOT in .gitignore"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo -e "${BLUE}🧪 Checking Project Structure...${NC}"
check_file "src/openrouter/client.ts" "OpenRouter client exists"
check_file "src/ai/serviceManager.ts" "AI service manager exists"
check_file "src/util/userProfiling.ts" "User profiling exists"
check_file "src/util/responseOptimizer.ts" "Response optimizer exists"
echo ""

echo -e "${BLUE}📦 Checking Dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠️${NC}  Dependencies not installed (run: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✅${NC} Package lock file exists"
else
    echo -e "${YELLOW}⚠️${NC}  No package-lock.json (run: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo -e "${BLUE}🏗️  Checking Build...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✅${NC} Project has been built"
else
    echo -e "${YELLOW}⚠️${NC}  Project not built (run: npm run build)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo -e "${BLUE}🔧 Checking Scripts...${NC}"
if [ -x "setup.sh" ]; then
    echo -e "${GREEN}✅${NC} setup.sh is executable"
else
    echo -e "${YELLOW}⚠️${NC}  setup.sh not executable (run: chmod +x setup.sh)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "start.sh" ]; then
    if [ -x "start.sh" ]; then
        echo -e "${GREEN}✅${NC} start.sh exists and is executable"
    else
        echo -e "${YELLOW}⚠️${NC}  start.sh not executable"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️${NC}  start.sh doesn't exist (run: ./setup.sh to create)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "================================================"
echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Your fork is ready to publish!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Replace YOUR_USERNAME in all files (if not done)"
    echo "  2. Create GitHub repository"
    echo "  3. git push origin main"
    echo "  4. git tag -a v2.0.0 -m 'Enhanced fork'"
    echo "  5. git push origin v2.0.0"
    echo "  6. Announce on Bluesky!"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Ready with $WARNINGS warnings${NC}"
    echo ""
    echo "Review warnings above, then you can publish!"
else
    echo -e "${RED}❌ Found $ERRORS errors and $WARNINGS warnings${NC}"
    echo ""
    echo "Please fix errors before publishing."
fi

echo ""
echo "For more details, see: PUBLICATION_READY.md"
echo ""

exit $ERRORS
