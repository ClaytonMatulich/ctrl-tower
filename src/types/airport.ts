/**
 * Airport types for search and selection
 */

export interface AirportSuggestion {
  iataCode: string;
  icaoCode?: string;
  name: string;
  city?: string;
  countryCode: string;
}

/**
 * Selected airport for the app
 */
export interface SelectedAirport {
  code: string;
  name: string;
}
