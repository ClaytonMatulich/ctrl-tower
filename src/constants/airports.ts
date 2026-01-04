/**
 * Common airport IATA codes
 * 
 * Quick reference for major airports.
 * This is a starter list; the application will fetch full data from AirLabs API.
 */

export const commonAirports = {
  // United States
  SFO: 'San Francisco International',
  LAX: 'Los Angeles International',
  JFK: 'John F. Kennedy International',
  ORD: 'Chicago O\'Hare International',
  ATL: 'Hartsfield-Jackson Atlanta International',
  DFW: 'Dallas/Fort Worth International',
  DEN: 'Denver International',
  SEA: 'Seattle-Tacoma International',
  MIA: 'Miami International',
  BOS: 'Boston Logan International',
  
  // International
  LHR: 'London Heathrow',
  CDG: 'Paris Charles de Gaulle',
  FRA: 'Frankfurt Airport',
  AMS: 'Amsterdam Airport Schiphol',
  DXB: 'Dubai International',
  SIN: 'Singapore Changi Airport',
  HKG: 'Hong Kong International',
  NRT: 'Tokyo Narita International',
  SYD: 'Sydney Airport',
  YYZ: 'Toronto Pearson International',
} as const;

export type AirportCode = keyof typeof commonAirports;
