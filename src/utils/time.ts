/**
 * Time and timezone utilities
 */

/**
 * Airport timezone mappings (IATA code -> timezone)
 */
const AIRPORT_TIMEZONES: Record<string, string> = {
  SFO: "America/Los_Angeles",
  LAX: "America/Los_Angeles",
  JFK: "America/New_York",
  ORD: "America/Chicago",
  DFW: "America/Chicago",
  ATL: "America/New_York",
  DEN: "America/Denver",
  SEA: "America/Los_Angeles",
  MIA: "America/New_York",
  BOS: "America/New_York",
  LHR: "Europe/London",
  CDG: "Europe/Paris",
  FRA: "Europe/Berlin",
  AMS: "Europe/Amsterdam",
  DXB: "Asia/Dubai",
  SIN: "Asia/Singapore",
  HKG: "Asia/Hong_Kong",
  NRT: "Asia/Tokyo",
  SYD: "Australia/Sydney",
  YYZ: "America/Toronto",
};

/**
 * Get timezone for an airport IATA code
 */
export function getAirportTimezone(iataCode: string): string {
  return AIRPORT_TIMEZONES[iataCode] || "UTC";
}

/**
 * Convert UTC time string to Date object
 */
export function parseUTCTime(timeString: string): Date {
  const normalized = timeString.replace(" ", "T");

  if (
    !normalized.includes("Z") &&
    !normalized.includes("+") &&
    !normalized.includes("-", 10)
  ) {
    return new Date(normalized + "Z");
  }

  return new Date(normalized);
}

/**
 * Format a Date object as local time for an airport
 * Returns format: "HH:MM" (24-hour)
 */
export function formatLocalTime(date: Date, airportCode: string): string {
  const timezone = getAirportTimezone(airportCode);

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  return formatter.format(date);
}

/**
 * Get current time for an airport
 * Returns format: "HH:MM:SS"
 */
export function getCurrentLocalTime(airportCode: string): string {
  const timezone = getAirportTimezone(airportCode);

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  return formatter.format(new Date());
}
