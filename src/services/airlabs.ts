/**
 * AirLabs API Client
 *
 * Handles fetching flight data from AirLabs API and mapping
 * to our domain types.
 */

import { z } from "zod";
import { config } from "../constants/config";
import {
  AirLabsSchedulesResponseSchema,
  type AirLabsSchedule,
} from "../types/api/airlabs";
import { type Flight } from "../types/flight";
import { parseUTCTime, isWithinHours } from "../utils/time";
import { debug, error as logError, logObject } from "../utils/logger";

/**
 * Fetch departures for a given airport
 * Returns flights departing within the next 12 hours
 */
export async function fetchDepartures(airportCode: string): Promise<Flight[]> {
  const apiKey = config.api.airlabs.key;

  if (!apiKey) {
    throw new Error(
      "AirLabs API key not configured. Set AIRLABS_API_KEY in .env"
    );
  }

  const url = `${config.api.airlabs.baseUrl}/schedules?dep_iata=${airportCode}&api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(config.api.airlabs.timeout),
    });

    if (!response.ok) {
      throw new Error(
        `AirLabs API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate response with Zod
    const validated = AirLabsSchedulesResponseSchema.parse(data);

    // Map API response to domain types
    const flights = validated.response
      .map(mapScheduleToFlight)
      .filter((flight): flight is Flight => flight !== null);

    debug("AirLabs API Response", flights);

    return flights;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError("AirLabs API response validation failed");
      logObject("Validation issues", error.issues);
      logObject("Validation errors (formatted)", error.format());
      throw new Error("Invalid API response format");
    }

    if (error instanceof Error) {
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        throw new Error("Request timeout. Please try again.");
      }
      throw error;
    }

    throw new Error("Unknown error fetching departures");
  }
}

/**
 * Map AirLabs schedule to our Flight domain type
 * Returns null if the schedule is invalid or missing critical data
 */
function mapScheduleToFlight(schedule: AirLabsSchedule): Flight | null {
  // Skip if missing critical fields
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
    destination: schedule.arr_iata, // For now, using IATA code as name
    destinationCode: schedule.arr_iata,
    scheduledTime,
    estimatedTime,
    gate: schedule.dep_gate ?? null,
    terminal: schedule.dep_terminal ?? null,
    status: schedule.status,
    delayMinutes: schedule.dep_delayed ?? null,
  };
}

/**
 * Fetch airport information (for future use)
 * Could be used to get full airport names instead of codes
 */
export async function fetchAirportInfo(airportCode: string): Promise<any> {
  const apiKey = config.api.airlabs.key;

  if (!apiKey) {
    throw new Error("AirLabs API key not configured");
  }

  const url = `${config.api.airlabs.baseUrl}/airports?iata_code=${airportCode}&api_key=${apiKey}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(config.api.airlabs.timeout),
  });

  if (!response.ok) {
    throw new Error(`AirLabs API error: ${response.status}`);
  }

  return response.json();
}
