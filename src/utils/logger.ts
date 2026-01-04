/**
 * Logger utility for debugging in TUI environment
 * 
 * Writes logs to a file since console output is hidden by the TUI
 */

import { appendFileSync, writeFileSync } from 'fs';

const LOG_FILE = 'debug.log';
let isInitialized = false;

/**
 * Initialize the debug logger
 * Clears any existing log file
 */
function initLogger() {
  if (!isInitialized) {
    try {
      writeFileSync(LOG_FILE, `=== Debug Log Started at ${new Date().toISOString()} ===\n\n`);
      isInitialized = true;
    } catch (error) {
      // Silently fail if we can't write logs
    }
  }
}

/**
 * Log a debug message to file
 */
export function debug(...args: any[]) {
  initLogger();
  
  const timestamp = new Date().toISOString();
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  try {
    appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
  } catch (error) {
    // Silently fail
  }
}

/**
 * Log an error to file
 */
export function error(...args: any[]) {
  initLogger();
  
  const timestamp = new Date().toISOString();
  const message = args.map(arg => {
    if (arg instanceof Error) {
      return `${arg.message}\n${arg.stack}`;
    }
    return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
  }).join(' ');
  
  try {
    appendFileSync(LOG_FILE, `[${timestamp}] ERROR: ${message}\n`);
  } catch (e) {
    // Silently fail
  }
}

/**
 * Log an object with a label
 */
export function logObject(label: string, obj: any) {
  debug(`${label}:`, JSON.stringify(obj, null, 2));
}
