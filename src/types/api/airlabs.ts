/**
 * AirLabs API response types
 *
 * Plain TypeScript interfaces for API responses.
 */

/**
 * Schedule entry from schedules API
 * https://airlabs.co/api/v9/schedules
 */
export interface AirLabsSchedule {
  // core flight identifiers
  airline_iata: string | null;
  airline_icao: string | null;
  flight_iata: string | null;
  flight_icao: string | null;
  flight_number: string | null;

  // departure
  dep_iata: string | null;
  dep_icao: string | null;
  dep_terminal?: string | null;
  dep_gate?: string | null;
  dep_time: string | null;
  dep_time_ts?: number | null;
  dep_estimated?: string | null;
  dep_delayed?: number | null;

  // arrival
  arr_iata: string | null;
  arr_icao: string | null;
  arr_time: string | null;

  // status
  status: "scheduled" | "active" | "landed" | "cancelled" | null;
}

export interface AirLabsSchedulesResponse {
  response: AirLabsSchedule[];
}

/**
 * Airport suggestion from suggest API
 * https://airlabs.co/api/v9/suggest
 */
export interface AirLabsAirportSuggestion {
  iata_code: string;
  icao_code?: string;
  name: string;
  city?: string;
  country_code: string;
  lat?: number;
  lng?: number;
}

export interface AirLabsSuggestResponseData {
  airports: AirLabsAirportSuggestion[];
  airports_by_cities: AirLabsAirportSuggestion[];
  airports_by_countries: AirLabsAirportSuggestion[];
}

export interface AirLabsSuggestResponse {
  response: AirLabsSuggestResponseData;
}
