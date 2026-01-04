/**
 * OpenSky Network API response types
 * 
 * Zod schemas for runtime validation of OpenSky API responses.
 * The OpenSky API returns data as arrays (tuples), not objects.
 */

import { z } from 'zod';

/**
 * State vector tuple indices
 * 
 * OpenSky returns each aircraft state as an array with 17 elements:
 * [0]  icao24: string
 * [1]  callsign: string | null
 * [2]  origin_country: string
 * [3]  time_position: number | null (Unix timestamp)
 * [4]  last_contact: number (Unix timestamp)
 * [5]  longitude: number | null
 * [6]  latitude: number | null
 * [7]  baro_altitude: number | null (meters)
 * [8]  on_ground: boolean
 * [9]  velocity: number | null (m/s)
 * [10] true_track: number | null (degrees)
 * [11] vertical_rate: number | null (m/s)
 * [12] sensors: number[] | null
 * [13] geo_altitude: number | null (meters)
 * [14] squawk: string | null
 * [15] spi: boolean
 * [16] position_source: number
 */

export const OpenSkyStateVectorSchema = z.tuple([
  z.string(),                    // [0] icao24
  z.string().nullable(),         // [1] callsign
  z.string(),                    // [2] origin_country
  z.number().nullable(),         // [3] time_position
  z.number(),                    // [4] last_contact
  z.number().nullable(),         // [5] longitude
  z.number().nullable(),         // [6] latitude
  z.number().nullable(),         // [7] baro_altitude
  z.boolean(),                   // [8] on_ground
  z.number().nullable(),         // [9] velocity
  z.number().nullable(),         // [10] true_track
  z.number().nullable(),         // [11] vertical_rate
  z.array(z.number()).nullable(),// [12] sensors
  z.number().nullable(),         // [13] geo_altitude
  z.string().nullable(),         // [14] squawk
  z.boolean(),                   // [15] spi
  z.number(),                    // [16] position_source
]);

export type OpenSkyStateVector = z.infer<typeof OpenSkyStateVectorSchema>;

/**
 * States API response
 * https://opensky-network.org/api/states/all
 */
export const OpenSkyStatesResponseSchema = z.object({
  time: z.number(), // Unix timestamp
  states: z.array(OpenSkyStateVectorSchema).nullable(),
});

export type OpenSkyStatesResponse = z.infer<typeof OpenSkyStatesResponseSchema>;

/**
 * Helper type for easier access to state vector fields
 */
export interface OpenSkyState {
  icao24: string;
  callsign: string | null;
  originCountry: string;
  timePosition: number | null;
  lastContact: number;
  longitude: number | null;
  latitude: number | null;
  baroAltitude: number | null;
  onGround: boolean;
  velocity: number | null;
  trueTrack: number | null;
  verticalRate: number | null;
  sensors: number[] | null;
  geoAltitude: number | null;
  squawk: string | null;
  spi: boolean;
  positionSource: number;
}

/**
 * Convert state vector tuple to typed object
 */
export function parseStateVector(vector: OpenSkyStateVector): OpenSkyState {
  return {
    icao24: vector[0],
    callsign: vector[1],
    originCountry: vector[2],
    timePosition: vector[3],
    lastContact: vector[4],
    longitude: vector[5],
    latitude: vector[6],
    baroAltitude: vector[7],
    onGround: vector[8],
    velocity: vector[9],
    trueTrack: vector[10],
    verticalRate: vector[11],
    sensors: vector[12],
    geoAltitude: vector[13],
    squawk: vector[14],
    spi: vector[15],
    positionSource: vector[16],
  };
}
