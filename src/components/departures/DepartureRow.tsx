/**
 * DepartureRow Component
 *
 * Displays a single flight departure row
 */

import type { Flight } from "../../types/flight";
import { formatLocalTime } from "../../utils/time";

interface DepartureRowProps {
  flight: Flight;
  airportCode: string;
}

function getStatusColor(status: Flight["status"]): string {
  switch (status) {
    case "cancelled":
      return "#FF0000";
    case "active":
      return "#CC7000";
    case "landed":
      return "#FFBB33";
    case "scheduled":
    default:
      return "#FFA500";
  }
}

function formatStatus(flight: Flight): string {
  switch (flight.status) {
    case "cancelled":
      return "CANCELLED";
    case "active":
      return "ACTIVE";
    case "landed":
      return "LANDED";
    case "scheduled":
    default:
      return "SCHEDULED";
  }
}

export function DepartureRow({ flight, airportCode }: DepartureRowProps) {
  const timeStr = formatLocalTime(flight.scheduledTime, airportCode);
  const statusColor = getStatusColor(flight.status);
  const statusText = formatStatus(flight);

  const flightNum = flight.flightNumber.padEnd(8);
  const destination = `${flight.destinationCode} (${flight.destination})`.padEnd(22);
  const gate = (flight.gate || "---").padEnd(8);

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
