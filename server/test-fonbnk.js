#!/usr/bin/env node

/**
 * Test script for Fonbnk server integration
 * Run this script to test your server endpoints
 */

const axios = require('axios');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const TEST_WALLET = '0x1234567890123456789012345678901234567890';
const TEST_PHONE = '+2348012345678';
const TEST_AMOUNT = 1000; // 1000 NGN

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testServerHealth() {
  try {
    logInfo('Testing server health...');
    
    const response = await axios.get(`${SERVER_URL}/api/health`, { timeout: 5000 });
    
    if (response.status === 200) {
      logSuccess('Server is running and healthy');
      return true;
    } else {
      logError(`Server returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logError('Server is not running. Please start the server first.');
      logInfo('Run: cd server && npm start');
    } else if (error.code === 'ENOTFOUND') {
      logError(`Cannot connect to server at ${SERVER_URL}`);
    } else {
      logError(`Health check failed: ${error.message}`);
    }
    return false;
  }
}

async function testOnrampInitiation() {
  try {
    logInfo('Testing onramp initiation...');
    
    const payload = {
      phoneNumber: TEST_PHONE,
      walletAddress: TEST_WALLET,
      amount: TEST_AMOUNT,
      fiatCurrency: 'NGN',
      cryptoCurrency: 'USDC',
      network: 'BASE',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    logInfo(`Payload: ${JSON.stringify(payload, null, 2)}`);
    
    const response = await axios.post(`${SERVER_URL}/api/fonbnk/onramp`, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('Onramp initiated successfully!');
      logInfo(`Session ID: ${response.data.sessionId}`);
      logInfo(`Status: ${response.data.status}`);
      logInfo(`Checkout URL: ${response.data.checkoutUrl || 'Not provided'}`);
      
      return response.data.sessionId;
    } else {
      logError('Onramp initiation failed');
      logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      logError(`HTTP ${status}: ${data.error || 'Unknown error'}`);
      
      if (data.details) {
        logError(`Details: ${data.details}`);
      }
      
      if (status === 401) {
        logWarning('Check your Fonbnk API key configuration');
      } else if (status === 422) {
        logWarning('Check your request payload format');
      }
    } else if (error.code === 'ECONNABORTED') {
      logError('Request timed out. Check if Fonbnk service is responding.');
    } else {
      logError(`Request failed: ${error.message}`);
    }
    return null;
  }
}

async function testSessionStatus(sessionId) {
  if (!sessionId) {
    logWarning('No session ID to test');
    return;
  }

  try {
    logInfo(`Testing session status for: ${sessionId}`);
    
    const response = await axios.get(`${SERVER_URL}/api/fonbnk/onramp/${sessionId}`, {
      timeout: 10000
    });

    if (response.status === 200 && response.data.success) {
      const session = response.data.session;
      logSuccess('Session status retrieved successfully!');
      logInfo(`Status: ${session.status}`);
      logInfo(`Wallet: ${session.walletAddress}`);
      logInfo(`Amount: ${session.amount} ${session.fiatCurrency}`);
      logInfo(`Created: ${session.createdAt}`);
    } else {
      logError('Failed to retrieve session status');
      logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      logError(`HTTP ${status}: ${data.error || 'Unknown error'}`);
    } else {
      logError(`Request failed: ${error.message}`);
    }
  }
}

async function testOnrampHistory() {
  try {
    logInfo('Testing onramp history...');
    
    const response = await axios.get(`${SERVER_URL}/api/fonbnk/history/${TEST_WALLET}`, {
      timeout: 10000
    });

    if (response.status === 200 && response.data.success) {
      const sessions = response.data.sessions;
      logSuccess(`Retrieved ${sessions.length} onramp sessions`);
      
      if (sessions.length > 0) {
        sessions.forEach((session, index) => {
          logInfo(`Session ${index + 1}:`);
          logInfo(`  ID: ${session.id}`);
          logInfo(`  Status: ${session.status}`);
          logInfo(`  Amount: ${session.amount} ${session.fiatCurrency}`);
          logInfo(`  Created: ${session.createdAt}`);
        });
      }
    } else {
      logError('Failed to retrieve onramp history');
      logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      logError(`HTTP ${status}: ${data.error || 'Unknown error'}`);
    } else {
      logError(`Request failed: ${error.message}`);
    }
  }
}

async function runTests() {
  log('🚀 Starting Fonbnk Server Integration Tests', 'bright');
  log('=' .repeat(50), 'cyan');
  
  // Test 1: Server Health
  const serverHealthy = await testServerHealth();
  if (!serverHealthy) {
    logError('Server health check failed. Stopping tests.');
    process.exit(1);
  }
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  // Test 2: Onramp Initiation
  const sessionId = await testOnrampInitiation();
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  // Test 3: Session Status (if we have a session ID)
  if (sessionId) {
    await testSessionStatus(sessionId);
  }
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  // Test 4: Onramp History
  await testOnrampHistory();
  
  log('\n' + '=' .repeat(50), 'cyan');
  log('🏁 Tests completed!', 'bright');
  
  if (sessionId) {
    logSuccess('Integration appears to be working correctly!');
    logInfo(`You can monitor session ${sessionId} for status updates.`);
  } else {
    logWarning('Some tests failed. Check your configuration and try again.');
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Fonbnk Server Integration Test Script', 'bright');
  log('Usage: node test-fonbnk.js [options]', 'cyan');
  log('\nOptions:', 'yellow');
  log('  --help, -h     Show this help message');
  log('  --server-url   Custom server URL (default: http://localhost:5000)');
  log('\nEnvironment Variables:', 'yellow');
  log('  SERVER_URL     Server URL to test against');
  log('\nExample:', 'cyan');
  log('  SERVER_URL=https://myapp.com node test-fonbnk.js');
  process.exit(0);
}

// Parse custom server URL
const serverUrlIndex = process.argv.indexOf('--server-url');
if (serverUrlIndex !== -1 && process.argv[serverUrlIndex + 1]) {
  process.env.SERVER_URL = process.argv[serverUrlIndex + 1];
  logInfo(`Using custom server URL: ${process.env.SERVER_URL}`);
}

// Run the tests
runTests().catch(error => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
});
