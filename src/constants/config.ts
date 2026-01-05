/**
 * Application configuration
 *
 * Runtime configuration loaded from environment variables.
 */

function getEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  /**
   * API Configuration
   */
  api: {
    airlabs: {
      baseUrl: "https://airlabs.co/api/v9",
      key: getEnv("AIRLABS_API_KEY"),
      timeout: 10000,
    },
  },

  /**
   * Display Configuration
   */
  display: {
    flightsPerPage: 10,
  },
} as const;
