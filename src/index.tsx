import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { App } from './app';
import { config, validateConfig } from './constants/config';

// Validate configuration on startup
const validation = validateConfig();
if (!validation.valid) {
  console.error('Configuration errors:');
  validation.errors.forEach((error) => console.error(`  - ${error}`));
  console.error('\nPlease check your .env file and try again.');
  process.exit(1);
}

// Log startup info
console.log('Starting Ctrl-Tower...');
console.log(`Default Airport: ${config.airport.default}`);
console.log(`Map Mode: ${config.map.defaultMode}`);
console.log('');

// Create renderer and render the application
const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
