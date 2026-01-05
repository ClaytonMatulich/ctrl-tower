/**
 * DeparturesBoard Component
 *
 * Main departures board display with pagination and manual refresh
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKeyboard } from "@opentui/react";
import { fetchDepartures } from "../../services/airlabs";
import { DepartureRow } from "./DepartureRow";
import { getCurrentLocalTime } from "../../utils/time";

const FLIGHTS_PER_PAGE = 10;

interface DeparturesBoardProps {
  airportCode: string;
}

export function DeparturesBoard({ airportCode }: DeparturesBoardProps) {
  const [currentPage, setCurrentPage] = useState(0);

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

  // pagination
  const totalFlights = flights?.length || 0;
  const totalPages = Math.ceil(totalFlights / FLIGHTS_PER_PAGE);
  const startIdx = currentPage * FLIGHTS_PER_PAGE;
  const endIdx = startIdx + FLIGHTS_PER_PAGE;
  const currentFlights = flights?.slice(startIdx, endIdx) || [];

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

  if (isLoading) {
    return (
      <box flexDirection="column" height="100%" padding={2}>
        <box
          border
          borderStyle="single"
          borderColor="#FFA500"
          padding={1}
          height="100%"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg="#FFA500">Loading departures...</text>
          </box>
        </box>
      </box>
    );
  }

  if (error) {
    return (
      <box flexDirection="column" height="100%" padding={2}>
        <box
          border
          borderStyle="single"
          borderColor="#FF0000"
          padding={1}
          height="100%"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg="#FF0000">Error loading departures</text>
            <box marginTop={1}>
              <text fg="#FFA500">
                {error instanceof Error ? error.message : "Unknown error"}
              </text>
            </box>
            <box marginTop={2}>
              <text fg="#FFD700">Press R to retry</text>
            </box>
          </box>
        </box>
      </box>
    );
  }

  if (totalFlights === 0) {
    return (
      <box flexDirection="column" height="100%" padding={2}>
        <box
          border
          borderStyle="single"
          borderColor="#FFA500"
          padding={1}
          height="100%"
        >
          <box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <text fg="#FFA500">No departures scheduled</text>
            <box marginTop={2}>
              <text fg="#FFD700">Press R to refresh</text>
            </box>
          </box>
        </box>
      </box>
    );
  }

  const currentTime = getCurrentLocalTime(airportCode);

  return (
    <box flexDirection="column" height="100%" padding={2}>
      <box
        border
        borderStyle="single"
        borderColor="#FFA500"
        padding={1}
        height="100%"
      >
        <box flexDirection="column" height="100%">
          {/* header */}
          <box flexDirection="row" justifyContent="space-between" marginBottom={1}>
            <text fg="#FFA500">DEPARTURES - {airportCode}</text>
            <text fg="#FFA500">{currentTime}</text>
          </box>

          {isFetching && (
            <box marginBottom={1}>
              <text fg="#FFD700">Refreshing...</text>
            </box>
          )}

          {/* table header */}
          <box marginBottom={1}>
            <text fg="#FFA500">
              Time   Flight    Destination             Gate    Status
            </text>
          </box>
          <box marginBottom={1}>
            <text fg="#FFA500">
              ──────────────────────────────────────────────────────────────────
            </text>
          </box>

          {/* flight rows */}
          <box flexDirection="column">
            {currentFlights.map((flight) => (
              <DepartureRow
                key={flight.id}
                flight={flight}
                airportCode={airportCode}
              />
            ))}
          </box>

          <box flexGrow={1} />

          {/* pagination */}
          {totalPages > 1 && (
            <box flexDirection="column" marginTop={1}>
              <box alignItems="center" justifyContent="center">
                <text fg="#FFA500">
                  Page {currentPage + 1} of {totalPages}
                </text>
              </box>
            </box>
          )}

          <box marginTop={1}>
            <text fg="#FFD700">
              [R] Refresh{totalPages > 1 && "  [←][→] Page"}
            </text>
          </box>
        </box>
      </box>
    </box>
  );
}
