#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('Applying database schema changes...');

try {
  // Run drizzle-kit push with the --accept-data-loss flag to apply changes without interactive prompts
  execSync('npx drizzle-kit push --accept-data-loss', { stdio: 'inherit' });
  console.log('Database schema updated successfully!');
} catch (error) {
  console.error('Error updating database schema:', error.message);
  process.exit(1);
}