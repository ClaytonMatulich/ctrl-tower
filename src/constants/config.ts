/**
 * Application configuration
 * 
 * Runtime configuration loaded from environment variables with sensible defaults.
 * All configuration is centralized here for easy maintenance.
 */

function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] ?? defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() !== 'false';
}

export const config = {
  /**
   * API Configuration
   */
  api: {
    airlabs: {
      baseUrl: 'https://airlabs.co/api/v9',
      key: getEnv('AIRLABS_API_KEY'),
      timeout: 10000, // 10 seconds
    },
    opensky: {
      baseUrl: 'https://opensky-network.org/api',
      username: getEnv('OPENSKY_USERNAME'),
      password: getEnv('OPENSKY_PASSWORD'),
      timeout: 10000, // 10 seconds
    },
  },

  /**
   * Airport Configuration
   */
  airport: {
    default: getEnv('DEFAULT_AIRPORT', 'SFO'),
  },

  /**
   * Refresh Intervals (seconds)
   */
  refresh: {
    schedules: getEnvNumber('SCHEDULES_REFRESH_INTERVAL', 300), // 5 minutes
    aircraft: getEnvNumber('AIRCRAFT_REFRESH_INTERVAL', 10), // 10 seconds
  },

  /**
   * Map Configuration
   */
  map: {
    defaultMode: getEnv('MAP_VIEW_MODE', 'global') as 'global' | 'regional',
    regionalRadius: getEnvNumber('REGIONAL_MAP_RADIUS', 300), // kilometers
  },

  /**
   * Performance Configuration
   */
  performance: {
    targetFPS: getEnvNumber('TARGET_FPS', 60),
    enableCRTEffects: getEnvBoolean('ENABLE_CRT_EFFECTS', true),
    enableAnimations: getEnvBoolean('ENABLE_ANIMATIONS', true),
  },

  /**
   * Cache Configuration (seconds)
   */
  cache: {
    ttlSchedules: getEnvNumber('CACHE_TTL_SCHEDULES', 300), // 5 minutes
    ttlStatic: getEnvNumber('CACHE_TTL_STATIC', 86400), // 24 hours
  },

  /**
   * Display Configuration
   */
  display: {
    flightsPerPage: 10, // Number of flights to show per page
  },
} as const;

/**
 * Validate required configuration on startup
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.api.airlabs.key) {
    errors.push('AIRLABS_API_KEY is required. Get one at https://airlabs.co/signup');
  }

  if (config.airport.default.length !== 3) {
    errors.push('DEFAULT_AIRPORT must be a 3-letter IATA code (e.g., SFO)');
  }

  if (config.refresh.schedules < 60) {
    errors.push('SCHEDULES_REFRESH_INTERVAL should be at least 60 seconds to avoid rate limits');
  }

  if (config.performance.targetFPS < 1 || config.performance.targetFPS > 144) {
    errors.push('TARGET_FPS should be between 1 and 144');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
