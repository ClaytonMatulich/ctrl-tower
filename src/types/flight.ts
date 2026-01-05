/**
 * Flight domain types
 *
 * These types represent the core business domain for flights,
 * independent of any external API structure.
 */

/**
 * Core flight information for departures board
 */
export type Flight = {
  id: string; // Unique identifier (flight_iata + dep_time_ts)
  flightNumber: string; // e.g., "AA2421"
  airline: string; // e.g., "AA"
  destination: string; // e.g., "New York"
  destinationCode: string; // e.g., "JFK"
  scheduledTime: Date; // Scheduled departure time
  estimatedTime: Date | null; // Estimated departure time (if available)
  gate: string | null; // Gate number (e.g., "D11")
  terminal: string | null; // Terminal (e.g., "2")
  status: "scheduled" | "cancelled" | "active" | "landed" | null; // Current flight status
  delayMinutes: number | null; // Minutes delayed (if applicable)
};

/**
 * Pagination info for flight lists
 */
export type FlightPagination = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
};
