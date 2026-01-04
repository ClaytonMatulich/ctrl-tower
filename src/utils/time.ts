/**
 * Time and timezone utilities
 * 
 * Handles conversion between UTC and local airport times
 */

/**
 * Airport timezone mappings (IATA code -> timezone)
 * 
 * For MVP, we only need SFO. Can expand later.
 */
const AIRPORT_TIMEZONES: Record<string, string> = {
  SFO: 'America/Los_Angeles', // PST/PDT
  // Future: add more airports as needed
  // JFK: 'America/New_York',
  // ORD: 'America/Chicago',
  // LAX: 'America/Los_Angeles',
};

/**
 * Get timezone for an airport IATA code
 */
export function getAirportTimezone(iataCode: string): string {
  return AIRPORT_TIMEZONES[iataCode] || 'UTC';
}

/**
 * Convert UTC time string to Date object
 * Handles various formats from AirLabs API:
 * - "YYYY-MM-DD HH:mm"
 * - ISO 8601 strings
 */
export function parseUTCTime(timeString: string): Date {
  // AirLabs returns times like "2024-01-04 19:30"
  // We need to parse this as UTC
  const normalized = timeString.replace(' ', 'T');
  
  // If no timezone indicator, assume UTC
  if (!normalized.includes('Z') && !normalized.includes('+') && !normalized.includes('-', 10)) {
    return new Date(normalized + 'Z');
  }
  
  return new Date(normalized);
}

/**
 * Format a Date object as local time for an airport
 * Returns format: "HH:MM" (24-hour)
 * 
 * Example: formatLocalTime(date, 'SFO') => "19:30"
 */
export function formatLocalTime(date: Date, airportCode: string): string {
  const timezone = getAirportTimezone(airportCode);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  
  return formatter.format(date);
}

/**
 * Format a Date object as local date and time for an airport
 * Returns format: "MM/DD HH:MM"
 * 
 * Example: formatLocalDateTime(date, 'SFO') => "01/04 19:30"
 */
export function formatLocalDateTime(date: Date, airportCode: string): string {
  const timezone = getAirportTimezone(airportCode);
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  
  const datePart = dateFormatter.format(date);
  const timePart = timeFormatter.format(date);
  
  return `${datePart} ${timePart}`;
}

/**
 * Get current time for an airport
 * Returns format: "HH:MM:SS"
 */
export function getCurrentLocalTime(airportCode: string): string {
  const timezone = getAirportTimezone(airportCode);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  
  return formatter.format(new Date());
}

/**
 * Check if a time is within the next N hours from now
 * Useful for filtering flights
 */
export function isWithinHours(date: Date, hours: number): boolean {
  const now = new Date();
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return date >= now && date <= futureTime;
}

/**
 * Calculate minutes between two times
 */
export function getMinutesDifference(time1: Date, time2: Date): number {
  return Math.floor((time1.getTime() - time2.getTime()) / (1000 * 60));
}
