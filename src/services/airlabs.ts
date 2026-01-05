/**
 * AirLabs API Client
 *
 * Handles fetching flight data from AirLabs API.
 */

import { config } from "../constants/config";
import type {
  AirLabsSchedulesResponse,
  AirLabsSchedule,
  AirLabsSuggestResponse,
} from "../types/api/airlabs";
import type { Flight } from "../types/flight";
import type { AirportSuggestion } from "../types/airport";
import { parseUTCTime } from "../utils/time";
import { logger } from "../utils/logger";

/**
 * Fetch departures for a given airport
 */
export async function fetchDepartures(airportCode: string): Promise<Flight[]> {
  const apiKey = config.api.airlabs.key;

  if (!apiKey) {
    const error = new Error(
      "AirLabs API key not configured. Set AIRLABS_API_KEY in .env"
    );
    logger.error("API key missing", error);
    throw error;
  }

  const url = `${config.api.airlabs.baseUrl}/schedules?dep_iata=${airportCode}&api_key=${apiKey}`;
  logger.debug(`Fetching departures for ${airportCode}`);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(config.api.airlabs.timeout),
    });

    if (!response.ok) {
      const error = new Error(
        `AirLabs API error: ${response.status} ${response.statusText}`
      );
      logger.error(`API request failed for ${airportCode}`, error);
      throw error;
    }

    const data = (await response.json()) as AirLabsSchedulesResponse;
    logger.info(
      `Fetched ${data.response.length} departures for ${airportCode}`
    );

    const flights = data.response
      .map(mapScheduleToFlight)
      .filter((flight): flight is Flight => flight !== null);

    logger.debug(`Mapped to ${flights.length} valid flights`);
    return flights;
  } catch (error) {
    logger.error(`Failed to fetch departures for ${airportCode}`, error);
    throw error;
  }
}

/**
 * Search airports using the suggest API
 */
export async function searchAirports(
  query: string
): Promise<AirportSuggestion[]> {
  const apiKey = config.api.airlabs.key;

  if (!apiKey) {
    const error = new Error("AirLabs API key not configured");
    logger.error("API key missing for airport search", error);
    throw error;
  }

  if (query.length < 2) {
    logger.debug(`Search query too short: "${query}"`);
    return [];
  }

  const url = `${config.api.airlabs.baseUrl}/suggest?q=${encodeURIComponent(
    query
  )}&api_key=${apiKey}`;
  logger.debug(`Searching airports for query: "${query}"`);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(config.api.airlabs.timeout),
    });

    if (!response.ok) {
      const error = new Error(`AirLabs API error: ${response.status}`);
      logger.error(
        `Airport search API request failed for query "${query}"`,
        error
      );
      throw error;
    }

    const data = (await response.json()) as AirLabsSuggestResponse;
    logger.debug(`API response for "${query}":`, {
      airports: data.response.airports?.length || 0,
      airports_by_cities: data.response.airports_by_cities?.length || 0,
      airports_by_countries: data.response.airports_by_countries?.length || 0,
    });

    // combine all airport results and dedupe by iata code
    const allAirports = [
      ...(data.response.airports || []),
      ...(data.response.airports_by_cities || []),
      ...(data.response.airports_by_countries || []),
    ];

    const seen = new Set<string>();
    const unique: AirportSuggestion[] = [];

    for (const airport of allAirports) {
      if (!airport.iata_code || seen.has(airport.iata_code)) continue;
      seen.add(airport.iata_code);
      unique.push({
        iataCode: airport.iata_code,
        icaoCode: airport.icao_code,
        name: airport.name,
        city: airport.city,
        countryCode: airport.country_code,
      });
    }

    logger.info(`Found ${unique.length} unique airports for query "${query}"`);
    return unique;
  } catch (error) {
    logger.error(`Failed to search airports for query "${query}"`, error);
    throw error;
  }
}

/**
 * Map AirLabs schedule to our Flight domain type
 */
function mapScheduleToFlight(schedule: AirLabsSchedule): Flight | null {
  if (!schedule.flight_iata || !schedule.arr_iata || !schedule.dep_time) {
    return null;
  }

  const scheduledTime = parseUTCTime(schedule.dep_time);
  const estimatedTime = schedule.dep_estimated
    ? parseUTCTime(schedule.dep_estimated)
    : null;

  return {
    id: `${schedule.flight_iata}-${schedule.dep_time_ts ?? Date.now()}`,
    flightNumber: schedule.flight_iata,
    airline: schedule.airline_iata ?? "Unknown",
    destination: schedule.arr_iata,
    destinationCode: schedule.arr_iata,
    scheduledTime,
    estimatedTime,
    gate: schedule.dep_gate ?? null,
    terminal: schedule.dep_terminal ?? null,
    status: schedule.status,
    delayMinutes: schedule.dep_delayed ?? null,
  };
}
