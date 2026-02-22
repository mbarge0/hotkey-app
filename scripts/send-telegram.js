#!/usr/bin/env node

/**
 * Send Telegram notification via OpenClaw
 * 
 * Usage:
 *   ./send-telegram.js "Message text"
 */

const { execSync } = require('child_process');

const message = process.argv[2];

if (!message) {
  console.error('Usage: send-telegram.js "message text"');
  process.exit(1);
}

try {
  // Use OpenClaw message tool
  // Note: Telegram channel must be configured in gateway config first
  execSync(
    `openclaw message send --action send --channel telegram --message ${JSON.stringify(message)}`,
    { encoding: 'utf8', stdio: 'inherit' }
  );
  console.log('✅ Telegram notification sent');
} catch (err) {
  console.error('❌ Telegram notification failed:', err.message);
  console.log('💡 Make sure Telegram channel is configured in gateway config');
}
