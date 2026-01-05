/**
 * DeparturesBoard Component
 *
 * Main departures board display with pagination and manual refresh
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { fetchDepartures } from "../../services/airlabs";
import { DepartureRow } from "./DepartureRow";
import { getCurrentLocalTime } from "../../utils/time";
import { colors, tableChars, columnWidths } from "../../styles/theme";

// fixed UI elements that take up vertical space
const FIXED_ROWS = {
  header: 1,        // main app header bar
  tabBar: 1,        // tab navigation bar
  footer: 2,        // footer with shortcuts
  paddingTop: 1,    // departures board top padding
  borderTop: 1,     // departures board border
  tableHeader: 1,   // column headers
  separator: 1,     // separator line under headers
  pagination: 1,    // pagination indicator (when shown)
  borderBottom: 1,  // departures board border
};

const TOTAL_FIXED_ROWS = Object.values(FIXED_ROWS).reduce((sum, val) => sum + val, 0);

interface DeparturesBoardProps {
  airportCode: string;
}

// build the table header separator line
function buildSeparatorLine(): string {
  const { horizontal, cross } = tableChars;
  const parts = [
    horizontal.repeat(columnWidths.time),
    horizontal.repeat(columnWidths.flight),
    horizontal.repeat(columnWidths.destination),
    horizontal.repeat(columnWidths.terminal),
    horizontal.repeat(columnWidths.gate),
    horizontal.repeat(columnWidths.arrivalTime),
    horizontal.repeat(columnWidths.duration),
    horizontal.repeat(columnWidths.status),
  ];
  return parts.join(cross);
}

export function DeparturesBoard({ airportCode }: DeparturesBoardProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { height: terminalRows } = useTerminalDimensions();

  const {
    data: flights,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["departures", airportCode],
    queryFn: () => fetchDepartures(airportCode),
  });

  // calculate dynamic flights per page based on available terminal rows
  const availableRows = Math.max(1, terminalRows - TOTAL_FIXED_ROWS);
  const flightsPerPage = availableRows;

  // pagination
  const totalSchedules = flights?.length || 0;
  const totalPages = Math.ceil(totalSchedules / flightsPerPage);
  const startIdx = currentPage * flightsPerPage;
  const endIdx = startIdx + flightsPerPage;
  const currentSchedules = flights?.slice(startIdx, endIdx) || [];

  // reset page if out of bounds
  if (totalPages > 0 && currentPage >= totalPages) {
    setCurrentPage(Math.max(0, totalPages - 1));
  }

  useKeyboard((key) => {
    if (key.name === "r" || key.name === "R") {
      refetch();
    } else if ((key.name === "[" || key.name === "left") && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (
      (key.name === "]" || key.name === "right") &&
      currentPage < totalPages - 1
    ) {
      setCurrentPage(currentPage + 1);
    }
  });

  const currentTime = getCurrentLocalTime(airportCode);
  const separator = tableChars.vertical;

  // build title with status info
  const titleText = isFetching
    ? ` Departures ─ ${airportCode} ─ refreshing... `
    : ` Departures ─ ${airportCode} ─ ${currentTime} `;

  if (isLoading) {
    return (
      <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
        <box
          border
          borderStyle="rounded"
          borderColor={colors.border}
          height="100%"
          title=" Departures "
          titleAlignment="left"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg={colors.textDim}>Loading departures...</text>
          </box>
        </box>
      </box>
    );
  }

  if (error) {
    return (
      <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
        <box
          border
          borderStyle="rounded"
          borderColor={colors.error}
          height="100%"
          title=" Departures ─ Error "
          titleAlignment="left"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg={colors.error}>Failed to load departures</text>
            <box marginTop={1}>
              <text fg={colors.textDim}>
                {error instanceof Error ? error.message : "Unknown error"}
              </text>
            </box>
            <box marginTop={2}>
              <text fg={colors.accent}>Press [R] to retry</text>
            </box>
          </box>
        </box>
      </box>
    );
  }

  if (totalSchedules === 0) {
    return (
      <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
        <box
          border
          borderStyle="rounded"
          borderColor={colors.border}
          height="100%"
          title={titleText}
          titleAlignment="left"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg={colors.textDim}>No departures scheduled</text>
            <box marginTop={1}>
              <text fg={colors.accent}>Press [R] to refresh</text>
            </box>
          </box>
        </box>
      </box>
    );
  }

  return (
    <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
      <box
        border
        borderStyle="rounded"
        borderColor={colors.border}
        height="100%"
        title={titleText}
        titleAlignment="left"
        paddingLeft={1}
        paddingRight={1}
      >
        <box flexDirection="column" height="100%">
          {/* table header */}
          <box flexDirection="row" height={1}>
            <text fg={colors.textDim} width={columnWidths.time}>TIME</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.flight}>FLIGHT</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.destination}>TO</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.terminal}>TERM</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.gate}>GATE</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.arrivalTime}>ARR</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.duration}>DUR</text>
            <text fg={colors.textMuted}>{separator}</text>
            <text fg={colors.textDim} width={columnWidths.status}>STATUS</text>
          </box>

          {/* separator line */}
          <box height={1}>
            <text fg={colors.textMuted}>{buildSeparatorLine()}</text>
          </box>

          {/* flight rows */}
          <box flexDirection="column">
            {currentSchedules.map((schedule) => (
              <DepartureRow
                key={`${schedule.flight_iata}-${schedule.dep_time_ts}`}
                schedule={schedule}
                airportCode={airportCode}
              />
            ))}
          </box>

          <box flexGrow={1} />

          {/* pagination - only show if multiple pages */}
          {totalPages > 1 && (
            <box flexDirection="row" justifyContent="center" height={1}>
              <text fg={colors.textMuted}>
                ← {currentPage + 1}/{totalPages} →
              </text>
            </box>
          )}
        </box>
      </box>
    </box>
  );
}
