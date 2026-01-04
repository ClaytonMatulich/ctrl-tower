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
 */
export const AirLabsScheduleSchema = z.object({
  airline_iata: z.string(),
  airline_icao: z.string(),
  flight_iata: z.string(),
  flight_icao: z.string(),
  flight_number: z.string(),
  
  // Codeshare information (optional)
  cs_airline_iata: z.string().optional(),
  cs_flight_number: z.string().optional(),
  cs_flight_iata: z.string().optional(),
  
  // Departure
  dep_iata: z.string(),
  dep_icao: z.string(),
  dep_terminal: z.string().optional(),
  dep_gate: z.string().optional(),
  dep_time: z.string(), // Format: "YYYY-MM-DD HH:mm"
  dep_time_ts: z.number().optional(), // Unix timestamp
  dep_time_utc: z.string().optional(),
  dep_estimated: z.string().optional(),
  dep_estimated_ts: z.number().optional(),
  dep_estimated_utc: z.string().optional(),
  dep_actual: z.string().optional(),
  dep_actual_ts: z.number().optional(),
  dep_actual_utc: z.string().optional(),
  
  // Arrival
  arr_iata: z.string(),
  arr_icao: z.string(),
  arr_terminal: z.string().optional(),
  arr_gate: z.string().optional(),
  arr_baggage: z.string().optional(),
  arr_time: z.string(),
  arr_time_ts: z.number().optional(),
  arr_time_utc: z.string().optional(),
  arr_estimated: z.string().optional(),
  arr_estimated_ts: z.number().optional(),
  arr_estimated_utc: z.string().optional(),
  arr_actual: z.string().optional(),
  arr_actual_ts: z.number().optional(),
  arr_actual_utc: z.string().optional(),
  
  // Status
  status: z.enum(['scheduled', 'active', 'landed', 'cancelled']),
  
  // Delays
  duration: z.number().optional(),
  delayed: z.number().optional(), // deprecated
  dep_delayed: z.number().optional(), // minutes
  arr_delayed: z.number().optional(), // minutes
});

export type AirLabsSchedule = z.infer<typeof AirLabsScheduleSchema>;

export const AirLabsSchedulesResponseSchema = z.object({
  response: z.array(AirLabsScheduleSchema),
  request: z.object({
    lang: z.string().optional(),
    currency: z.string().optional(),
    time: z.number().optional(),
    id: z.string().optional(),
    server: z.string().optional(),
    host: z.string().optional(),
    pid: z.number().optional(),
    key: z.object({
      id: z.string(),
      api_key: z.string().optional(),
      type: z.string().optional(),
      expired: z.string().optional(),
      registered: z.string().optional(),
      upgraded: z.string().optional(),
      limit_by_month: z.number().optional(),
      limit_by_minute: z.number().optional(),
    }).optional(),
    params: z.any().optional(),
    version: z.number().optional(),
    method: z.string().optional(),
    count: z.number().optional(),
  }).optional(),
  terms: z.string().optional(),
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
