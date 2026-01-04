/**
 * Airport domain types
 */

export interface Airport {
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number; // meters
}

export interface City {
  name: string;
  iata: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface Country {
  name: string;
  iso2: string;
  iso3: string;
}
