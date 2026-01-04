/**
 * Flight domain types
 * 
 * These types represent the core business domain for flights,
 * independent of any external API structure.
 */

export type FlightStatus = 
  | 'scheduled' 
  | 'boarding' 
  | 'departed' 
  | 'active' 
  | 'landed' 
  | 'cancelled' 
  | 'diverted';

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface FlightLeg {
  airport: string;
  iata: string;
  icao?: string;
  terminal?: string;
  gate?: string;
  scheduledTime: Date;
  estimatedTime?: Date;
  actualTime?: Date;
  delayed?: number; // minutes
}

export interface Flight {
  id: string; // Unique identifier (combination of flight number + date)
  flightNumber: string; // e.g., "2421"
  flightIATA: string; // e.g., "AA2421"
  flightICAO: string; // e.g., "AAL2421"
  airline: Airline;
  departure: FlightLeg;
  arrival: FlightLeg;
  status: FlightStatus;
  aircraft?: {
    registration?: string;
    icao24?: string;
    type?: string;
  };
}

export interface Schedule {
  flights: Flight[];
  airport: string;
  type: 'arrivals' | 'departures';
  lastUpdated: Date;
}
