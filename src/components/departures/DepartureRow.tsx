/**
 * DepartureRow Component
 *
 * Displays a single flight departure row with comprehensive flight information
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
  // show delay info if flight is delayed
  if (schedule.dep_delayed && schedule.dep_delayed > 0) {
    return `DELAYED +${schedule.dep_delayed}m`;
  }

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

function formatDuration(minutes?: number | null): string {
  if (!minutes) return "─";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins.toString().padStart(2, "0")}`;
}

function formatArrivalTime(schedule: AirLabsSchedule, airportCode: string): string {
  // prefer actual, then estimated, then scheduled
  const timeStr = schedule.arr_actual || schedule.arr_estimated || schedule.arr_time;
  if (!timeStr) return "─";

  const arrTime = parseUTCTime(timeStr);
  return formatLocalTime(arrTime, schedule.arr_iata || airportCode);
}

export function DepartureRow({ schedule, airportCode }: DepartureRowProps) {
  const scheduledTime = parseUTCTime(schedule.dep_time!);
  const depTimeStr = formatLocalTime(scheduledTime, airportCode);
  const statusColor = getStatusColor(schedule.status);
  const statusText = formatStatus(schedule);
  const separator = tableChars.vertical;

  // format display values with fallbacks
  const flightNumber = schedule.flight_iata || "─";
  const destination = schedule.arr_iata || "─";
  const terminal = schedule.dep_terminal || "─";
  const gate = schedule.dep_gate || "─";
  const arrTime = formatArrivalTime(schedule, airportCode);
  const duration = formatDuration(schedule.duration);

  return (
    <box flexDirection="row" height={1}>
      <text fg={colors.text} width={columnWidths.time}>{depTimeStr}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textBright} width={columnWidths.flight}>{flightNumber}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.text} width={columnWidths.destination}>{destination}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textDim} width={columnWidths.terminal}>{terminal}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textDim} width={columnWidths.gate}>{gate}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.text} width={columnWidths.arrivalTime}>{arrTime}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={colors.textDim} width={columnWidths.duration}>{duration}</text>
      <text fg={colors.textMuted}>{separator}</text>
      <text fg={statusColor} width={columnWidths.status}>{statusText}</text>
    </box>
  );
}
