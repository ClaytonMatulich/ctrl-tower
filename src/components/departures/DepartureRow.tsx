/**
 * DepartureRow Component
 * 
 * Displays a single flight departure as a row in the departures table
 */

import type { Flight } from '../../types/flight';
import { formatLocalTime } from '../../utils/time';
import { config } from '../../constants/config';

type DepartureRowProps = {
  flight: Flight;
};

/**
 * Get color for flight status
 */
function getStatusColor(status: Flight['status']): string {
  switch (status) {
    case 'cancelled':
      return '#FF0000'; // Red
    case 'active':
      return '#CC7000'; // Dimmed orange
    case 'landed':
      return '#FFBB33'; // Bright orange
    case 'scheduled':
    default:
      return '#FFA500'; // Standard orange
  }
}

/**
 * Format status for display
 */
function formatStatus(flight: Flight): string {
  switch (flight.status) {
    case 'cancelled':
      return 'CANCELLED';
    case 'active':
      return 'ACTIVE';
    case 'landed':
      return 'LANDED';
    case 'scheduled':
    default:
      return 'SCHEDULED';
  }
}

export function DepartureRow({ flight }: DepartureRowProps) {
  const airportCode = config.airport.default;
  const timeStr = formatLocalTime(flight.scheduledTime, airportCode);
  const statusColor = getStatusColor(flight.status);
  const statusText = formatStatus(flight);

  // Pad fields for alignment
  const flightNum = flight.flightNumber.padEnd(8);
  const destination = `${flight.destinationCode} (${flight.destination})`.padEnd(22);
  const gate = (flight.gate || '---').padEnd(8);

  return (
    <box flexDirection="row" width="100%">
      <text fg="#FFA500">{timeStr}  </text>
      <text fg="#FFA500">{flightNum}</text>
      <text fg="#FFA500">{destination}</text>
      <text fg="#FFA500">{gate}</text>
      <text fg={statusColor}>{statusText}</text>
    </box>
  );
}
