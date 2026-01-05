/**
 * DepartureRow Component
 *
 * Displays a single flight departure row with fixed-width columns
 */

import type { Flight } from "../../types/flight";
import { formatLocalTime } from "../../utils/time";
import { colors, tableChars, columnWidths } from "../../styles/theme";

interface DepartureRowProps {
  flight: Flight;
  airportCode: string;
}

function getStatusColor(status: Flight["status"]): string {
  switch (status) {
    case "cancelled":
      return colors.statusCancelled;
    case "active":
      return colors.statusActive;
    case "landed":
      return colors.statusLanded;
    case "scheduled":
    default:
      return colors.statusScheduled;
  }
}

function formatStatus(flight: Flight): string {
  switch (flight.status) {
    case "cancelled":
      return "CANCELLED";
    case "active":
      return "DEPARTED";
    case "landed":
      return "LANDED";
    case "scheduled":
    default:
      return "ON TIME";
  }
}

// truncate string to max length, adding ellipsis if needed
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

export function DepartureRow({ flight, airportCode }: DepartureRowProps) {
  const timeStr = formatLocalTime(flight.scheduledTime, airportCode);
  const statusColor = getStatusColor(flight.status);
  const statusText = formatStatus(flight);
  const separator = tableChars.vertical;

  // format destination: "LAX Los Angeles" or just code if name is too long
  const destDisplay = flight.destination
    ? truncate(`${flight.destinationCode} ${flight.destination}`, columnWidths.destination - 1)
    : flight.destinationCode;

  const gate = flight.gate || "─";

  return (
    <box flexDirection="row" height={1}>
      <text fg={colors.text} width={columnWidths.time}>{timeStr}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textBright} width={columnWidths.flight}>{flight.flightNumber}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.text} width={columnWidths.destination}>{destDisplay}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textDim} width={columnWidths.gate}>{gate}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={statusColor} width={columnWidths.status}>{statusText}</text>
    </box>
  );
}
