#!/usr/bin/env node

/**
 * Service Test Utility - Test AI services and PDS connectivity
 */

import 'dotenv/config';
import { getAIServiceManager } from '../dist/ai/serviceManager.js';
import { getOpenRouterClient } from '../dist/openrouter/client.js';
import { AtpAgent } from '@atproto/api';

const GREEN = '\033[0;32m';
const RED = '\033[0;31m';
const YELLOW = '\033[1;33m';
const BLUE = '\033[0;34m';
const NC = '\033[0m'; // No Color

async function testServices() {
  console.log(`${BLUE}🧪 Testing Enhanced Bluesky Bot Services${NC}`);
  console.log('=' * 50);
  
  const results = {
    pds: false,
    openrouter: false,
    gemini: false,
    overall: false
  };

  // Test 1: PDS Connection
  console.log(`\n${YELLOW}1. Testing AT Protocol PDS Connection...${NC}`);
  try {
    const pdsUrl = process.env.CUSTOM_PDS_URL || 'https://bsky.social';
    console.log(`   PDS URL: ${pdsUrl}`);
    
    const agent = new AtpAgent({ service: pdsUrl });
    const response = await fetch(`${pdsUrl}/xrpc/com.atproto.server.describeServer`);
    
    if (response.ok) {
      const serverInfo = await response.json();
      console.log(`   ${GREEN}✅ PDS connection successful${NC}`);
      console.log(`   Server: ${serverInfo.did || 'Unknown'}`);
      results.pds = true;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   ${RED}❌ PDS connection failed: ${error.message}${NC}`);
  }

  // Test 2: OpenRouter
  console.log(`\n${YELLOW}2. Testing OpenRouter AI Service...${NC}`);
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.log(`   ${YELLOW}⚠️  OPENROUTER_API_KEY not set${NC}`);
    } else {
      const openRouter = getOpenRouterClient();
      const usage = openRouter.getUsageStats();
      console.log(`   API Key: ${process.env.OPENROUTER_API_KEY.substring(0, 8)}...`);
      console.log(`   Daily usage: ${usage.dailyRequestCount}/${usage.dailyLimit}`);
      
      const testResult = await openRouter.testConnection();
      if (testResult) {
        console.log(`   ${GREEN}✅ OpenRouter connection successful${NC}`);
        results.openrouter = true;
      } else {
        throw new Error('Test response invalid');
      }
    }
  } catch (error) {
    console.log(`   ${RED}❌ OpenRouter connection failed: ${error.message}${NC}`);
  }

  // Test 3: Gemini
  console.log(`\n${YELLOW}3. Testing Google Gemini AI Service...${NC}`);
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log(`   ${YELLOW}⚠️  GEMINI_API_KEY not set${NC}`);
    } else {
      const aiService = getAIServiceManager();
      const testResults = await aiService.testServices();
      
      console.log(`   API Key: ${process.env.GEMINI_API_KEY.substring(0, 8)}...`);
      
      if (testResults.gemini) {
        console.log(`   ${GREEN}✅ Gemini connection successful${NC}`);
        results.gemini = true;
      } else {
        throw new Error('Test generation failed');
      }
    }
  } catch (error) {
    console.log(`   ${RED}❌ Gemini connection failed: ${error.message}${NC}`);
  }

  // Test 4: AI Service Manager
  console.log(`\n${YELLOW}4. Testing AI Service Manager...${NC}`);
  try {
    const aiService = getAIServiceManager();
    const stats = aiService.getStats();
    
    console.log(`   AI Service Preference: ${stats.currentPreference}`);
    console.log(`   OpenRouter Available: ${stats.openRouterAvailable ? '✅' : '❌'}`);
    console.log(`   Fallback Enabled: ${stats.fallbackEnabled ? '✅' : '❌'}`);
    
    if (results.openrouter || results.gemini) {
      console.log(`   ${GREEN}✅ AI Service Manager ready${NC}`);
    } else {
      throw new Error('No AI services available');
    }
  } catch (error) {
    console.log(`   ${RED}❌ AI Service Manager failed: ${error.message}${NC}`);
  }

  // Test 5: End-to-End Response Generation
  console.log(`\n${YELLOW}5. Testing End-to-End Response Generation...${NC}`);
  try {
    const aiService = getAIServiceManager();
    
    console.log(`   Generating test response...`);
    const response = await aiService.generateResponse(
      'Hello! This is a test message.',
      'conversation',
      { temperature: 0.7 }
    );
    
    console.log(`   ${GREEN}✅ Response generated successfully${NC}`);
    console.log(`   Service used: ${response.service}`);
    console.log(`   Response time: ${response.responseTime}ms`);
    console.log(`   Response: "${response.text.substring(0, 100)}..."`);
    results.overall = true;
    
  } catch (error) {
    console.log(`   ${RED}❌ Response generation failed: ${error.message}${NC}`);
  }

  // Summary
  console.log(`\n${BLUE}📊 Test Results Summary${NC}`);
  console.log('=' * 30);
  console.log(`PDS Connection:        ${results.pds ? '✅' : '❌'}`);
  console.log(`OpenRouter Service:    ${results.openrouter ? '✅' : '❌'}`);
  console.log(`Gemini Service:        ${results.gemini ? '✅' : '❌'}`);
  console.log(`End-to-End:           ${results.overall ? '✅' : '❌'}`);
  
  const readyServices = [results.openrouter, results.gemini].filter(Boolean).length;
  
  if (results.pds && readyServices > 0 && results.overall) {
    console.log(`\n${GREEN}🎉 All systems ready! Bot can start successfully.${NC}`);
    process.exit(0);
  } else if (readyServices > 0) {
    console.log(`\n${YELLOW}⚠️  Some services have issues, but bot can run with limitations.${NC}`);
    process.exit(1);
  } else {
    console.log(`\n${RED}❌ Critical services failed. Please check configuration.${NC}`);
    process.exit(2);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node test-services.js [options]

Options:
  --help, -h     Show this help message
  --verbose, -v  Show verbose output

This script tests:
  • AT Protocol PDS connectivity (including custom PDS)
  • OpenRouter AI service
  • Google Gemini AI service  
  • AI Service Manager functionality
  • End-to-end response generation

Exit codes:
  0 - All services ready
  1 - Some issues but can run
  2 - Critical failures
`);
  process.exit(0);
}

// Run tests
testServices().catch(error => {
  console.error(`\n${RED}💥 Unexpected error during testing:${NC}`, error);
  process.exit(3);
});