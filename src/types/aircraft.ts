/**
 * Aircraft domain types
 * 
 * These types represent live aircraft positions and tracking data,
 * primarily sourced from OpenSky Network with optional enrichment from AirLabs.
 */

export interface AircraftPosition {
  // Core identification
  icao24: string; // ICAO 24-bit address (hex)
  callsign: string; // e.g., "AAL2421"
  
  // Position
  latitude: number;
  longitude: number;
  altitude: number; // meters
  onGround: boolean;
  
  // Velocity
  velocity: number; // m/s
  heading: number; // degrees 0-359
  verticalRate: number; // m/s (positive = climbing, negative = descending)
  
  // Metadata
  originCountry: string;
  lastUpdate: Date;
  
  // Optional enrichment from AirLabs (if correlated)
  enrichment?: {
    flightNumber?: string;
    airline?: string;
    origin?: string; // IATA code
    destination?: string; // IATA code
    status?: string;
  };
}

export interface AircraftTrack {
  icao24: string;
  positions: Array<{
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: Date;
  }>;
}

/**
 * Map view modes
 */
export type MapViewMode = 'global' | 'regional';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RegionalMapConfig {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}
