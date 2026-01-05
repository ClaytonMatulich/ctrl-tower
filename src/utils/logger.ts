/**
 * Logger utility for debugging in TUI environment
 * 
 * Writes logs to a file since console output is hidden by the TUI.
 * Uses async file writes for better performance.
 */

const LOG_FILE = 'debug.log';

// log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// get configured log level from env, default to INFO
const configuredLevel = (() => {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  switch (envLevel) {
    case 'DEBUG': return LogLevel.DEBUG;
    case 'INFO': return LogLevel.INFO;
    case 'WARN': return LogLevel.WARN;
    case 'ERROR': return LogLevel.ERROR;
    default: return LogLevel.INFO;
  }
})();

let isInitialized = false;

/**
 * Initialize the debug logger
 * Clears any existing log file
 */
async function initLogger() {
  if (!isInitialized) {
    try {
      await Bun.write(LOG_FILE, `=== Debug Log Started at ${new Date().toISOString()} ===\n\n`);
      isInitialized = true;
    } catch (error) {
      // silently fail if we can't write logs
    }
  }
}

/**
 * Write a log message to file
 */
async function writeLog(level: LogLevel, levelName: string, args: any[]) {
  // skip if below configured level
  if (level < configuredLevel) {
    return;
  }

  await initLogger();
  
  const timestamp = new Date().toISOString();
  const message = args.map(arg => {
    if (arg instanceof Error) {
      return `${arg.message}\n${arg.stack}`;
    }
    return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
  }).join(' ');
  
  try {
    const file = Bun.file(LOG_FILE);
    const writer = file.writer();
    writer.write(`[${timestamp}] ${levelName}: ${message}\n`);
    await writer.end();
  } catch (error) {
    // silently fail
  }
}

/**
 * Log a debug message to file
 */
export function debug(...args: any[]) {
  writeLog(LogLevel.DEBUG, 'DEBUG', args);
}

/**
 * Log an info message to file
 */
export function info(...args: any[]) {
  writeLog(LogLevel.INFO, 'INFO', args);
}

/**
 * Log a warning to file
 */
export function warn(...args: any[]) {
  writeLog(LogLevel.WARN, 'WARN', args);
}

/**
 * Log an error to file
 */
export function error(...args: any[]) {
  writeLog(LogLevel.ERROR, 'ERROR', args);
}

/**
 * Log an object with a label
 */
export function logObject(label: string, obj: any) {
  info(`${label}:`, obj);
}

/**
 * Default logger instance
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  logObject,
};
