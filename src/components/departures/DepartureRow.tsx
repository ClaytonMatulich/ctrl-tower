/**
 * DepartureRow Component
 *
 * Displays a single flight departure row with fixed-width columns
 */

import type { AirLabsSchedule } from "../../types/api/airlabs";
import { formatLocalTime, parseUTCTime } from "../../utils/time";
import { colors, tableChars, columnWidths } from "../../styles/theme";

interface DepartureRowProps {
  schedule: AirLabsSchedule;
  airportCode: string;
}

function getStatusColor(status: AirLabsSchedule["status"]): string {
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

function formatStatus(schedule: AirLabsSchedule): string {
  switch (schedule.status) {
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

export function DepartureRow({ schedule, airportCode }: DepartureRowProps) {
  const scheduledTime = parseUTCTime(schedule.dep_time!);
  const timeStr = formatLocalTime(scheduledTime, airportCode);
  const statusColor = getStatusColor(schedule.status);
  const statusText = formatStatus(schedule);
  const separator = tableChars.vertical;

  const gate = schedule.dep_gate || "─";

  return (
    <box flexDirection="row" height={1}>
      <text fg={colors.text} width={columnWidths.time}>{timeStr}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textBright} width={columnWidths.flight}>{schedule.flight_iata}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.text} width={columnWidths.destination}>{schedule.arr_iata}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textDim} width={columnWidths.gate}>{gate}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={statusColor} width={columnWidths.status}>{statusText}</text>
    </box>
  );
}
