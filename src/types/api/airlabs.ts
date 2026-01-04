/**
 * AirLabs API response types
 * 
 * Zod schemas for runtime validation of API responses.
 * These ensure type safety at the boundary between external API and our domain.
 */

import { z } from 'zod';

/**
 * Schedules API response
 * https://airlabs.co/api/v9/schedules
 * 
 * Note: AirLabs API returns null for many optional fields instead of omitting them.
 * We use .nullable() to handle this, which allows both null and undefined.
 */
export const AirLabsScheduleSchema = z.object({
  // Core flight identifiers - these should always be present
  airline_iata: z.string().nullable(),
  airline_icao: z.string().nullable(),
  flight_iata: z.string().nullable(),
  flight_icao: z.string().nullable(),
  flight_number: z.string().nullable(),
  
  // Codeshare information (optional, can be null)
  cs_airline_iata: z.string().nullable().optional(),
  cs_flight_number: z.string().nullable().optional(),
  cs_flight_iata: z.string().nullable().optional(),
  
  // Departure
  dep_iata: z.string().nullable(),
  dep_icao: z.string().nullable(),
  dep_terminal: z.string().nullable().optional(),
  dep_gate: z.string().nullable().optional(),
  dep_time: z.string().nullable(), // Format: "YYYY-MM-DD HH:mm"
  dep_time_ts: z.number().nullable().optional(), // Unix timestamp
  dep_time_utc: z.string().nullable().optional(),
  dep_estimated: z.string().nullable().optional(),
  dep_estimated_ts: z.number().nullable().optional(),
  dep_estimated_utc: z.string().nullable().optional(),
  dep_actual: z.string().nullable().optional(),
  dep_actual_ts: z.number().nullable().optional(),
  dep_actual_utc: z.string().nullable().optional(),
  
  // Arrival
  arr_iata: z.string().nullable(),
  arr_icao: z.string().nullable(),
  arr_terminal: z.string().nullable().optional(),
  arr_gate: z.string().nullable().optional(),
  arr_baggage: z.string().nullable().optional(),
  arr_time: z.string().nullable(),
  arr_time_ts: z.number().nullable().optional(),
  arr_time_utc: z.string().nullable().optional(),
  arr_estimated: z.string().nullable().optional(),
  arr_estimated_ts: z.number().nullable().optional(),
  arr_estimated_utc: z.string().nullable().optional(),
  arr_actual: z.string().nullable().optional(),
  arr_actual_ts: z.number().nullable().optional(),
  arr_actual_utc: z.string().nullable().optional(),
  
  // Status
  status: z.enum(['scheduled', 'active', 'landed', 'cancelled']).nullable(),
  
  // Delays
  duration: z.number().nullable().optional(),
  delayed: z.number().nullable().optional(), // deprecated
  dep_delayed: z.number().nullable().optional(), // minutes
  arr_delayed: z.number().nullable().optional(), // minutes
});

export type AirLabsSchedule = z.infer<typeof AirLabsScheduleSchema>;

export const AirLabsSchedulesResponseSchema = z.object({
  response: z.array(AirLabsScheduleSchema),
  request: z.object({
    lang: z.string().nullable().optional(),
    currency: z.string().nullable().optional(),
    time: z.number().nullable().optional(),
    id: z.string().nullable().optional(),
    server: z.string().nullable().optional(),
    host: z.string().nullable().optional(),
    pid: z.number().nullable().optional(),
    key: z.object({
      id: z.union([z.string(), z.number()]).nullable(), // Can be string or number
      api_key: z.string().nullable().optional(),
      type: z.string().nullable().optional(),
      expired: z.string().nullable().optional(),
      registered: z.string().nullable().optional(),
      upgraded: z.string().nullable().optional(),
      limit_by_month: z.number().nullable().optional(),
      limit_by_minute: z.number().nullable().optional(),
    }).nullable().optional(),
    params: z.any().optional(),
    version: z.number().nullable().optional(),
    method: z.string().nullable().optional(),
    count: z.number().nullable().optional(),
  }).nullable().optional(),
  terms: z.string().nullable().optional(),
});

export type AirLabsSchedulesResponse = z.infer<typeof AirLabsSchedulesResponseSchema>;

/**
 * Real-time Flights API response
 * https://airlabs.co/api/v9/flights
 */
export const AirLabsFlightSchema = z.object({
  hex: z.string(),
  reg_number: z.string().optional(),
  flag: z.string(), // ISO 2 country code
  lat: z.number(),
  lng: z.number(),
  alt: z.number(), // meters
  dir: z.number(), // degrees
  speed: z.number(), // km/h
  v_speed: z.number(), // km/h
  squawk: z.string().optional(),
  
  // Flight info
  flight_number: z.string().optional(),
  flight_icao: z.string().optional(),
  flight_iata: z.string().optional(),
  
  // Airline
  airline_icao: z.string().optional(),
  airline_iata: z.string().optional(),
  
  // Airports
  dep_icao: z.string().optional(),
  dep_iata: z.string().optional(),
  arr_icao: z.string().optional(),
  arr_iata: z.string().optional(),
  
  // Aircraft
  aircraft_icao: z.string().optional(),
  
  // Status
  updated: z.number(), // Unix timestamp
  status: z.enum(['scheduled', 'en-route', 'landed']).optional(),
});

export type AirLabsFlight = z.infer<typeof AirLabsFlightSchema>;

export const AirLabsFlightsResponseSchema = z.object({
  response: z.array(AirLabsFlightSchema),
});

export type AirLabsFlightsResponse = z.infer<typeof AirLabsFlightsResponseSchema>;

/**
 * Airports database response
 */
export const AirLabsAirportSchema = z.object({
  name: z.string(),
  iata_code: z.string(),
  icao_code: z.string(),
  lat: z.string(), // String in API response
  lng: z.string(), // String in API response
  country_code: z.string(),
  city: z.string().optional(),
  timezone: z.string().optional(),
});

export type AirLabsAirport = z.infer<typeof AirLabsAirportSchema>;

export const AirLabsAirportsResponseSchema = z.object({
  response: z.array(AirLabsAirportSchema),
});

export type AirLabsAirportsResponse = z.infer<typeof AirLabsAirportsResponseSchema>;

/**
 * Error response
 */
export const AirLabsErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
  }),
});

export type AirLabsError = z.infer<typeof AirLabsErrorSchema>;
