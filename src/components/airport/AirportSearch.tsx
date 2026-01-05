/**
 * AirportSearch Component
 *
 * Search for airports using the AirLabs suggest API
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useKeyboard } from "@opentui/react";
import type { SelectOption } from "@opentui/core";
import { searchAirports } from "../../services/airlabs";
import type { SelectedAirport } from "../../types/airport";
import { logger } from "../../utils/logger";

interface AirportSearchProps {
  onSelect: (airport: SelectedAirport) => void;
}

export function AirportSearch({ onSelect }: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // debounce the query - waits for user to pause typing
  const [debouncedQuery] = useDebouncedValue(query, { wait: 500 });

  // fetch airport suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["airports", debouncedQuery],
    queryFn: () => searchAirports(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
  });

  // convert to SelectOption format
  const options: SelectOption[] = (suggestions || []).map((airport) => ({
    name: `[${airport.iataCode}] ${airport.name}`,
    description: airport.city
      ? `${airport.city}, ${airport.countryCode}`
      : airport.countryCode,
    value: JSON.stringify({
      code: airport.iataCode,
      name: airport.name,
    }),
  }));

  const hasResults = options.length > 0;
  const showResults = hasResults && !isLoading;

  // reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  // handle keyboard navigation and selection
  useKeyboard((key) => {
    if (!showResults) return;

    if (key.name === "up") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (key.name === "down") {
      setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (key.name === "return") {
      const option = options[selectedIndex];
      if (option) {
        const airport = JSON.parse(option.value as string) as SelectedAirport;
        logger.info(`Selected airport: ${airport.code} - ${airport.name}`);
        onSelect(airport);
        setQuery("");
        setSelectedIndex(0);
      }
    }
  });

  function handleInputChange(value: string) {
    setQuery(value);
  }

  return (
    <box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <box
        border
        borderStyle="double"
        borderColor="#FFA500"
        padding={1}
        flexDirection="column"
        width={80}
      >
        <box marginBottom={1}>
          <text fg="#FFD700">
            <strong>Search for an airport</strong>
          </text>
        </box>

        <box
          border
          borderColor="#996600"
          height={3}
          marginBottom={1}
        >
          <input
            placeholder="Type airport name or code..."
            focused={true}
            onInput={handleInputChange}
            backgroundColor="transparent"
          />
        </box>

        {isLoading && debouncedQuery.length >= 2 && (
          <box marginBottom={1}>
            <text fg="#996600">Searching...</text>
          </box>
        )}

        {showResults && (
          <box
            border
            borderColor="#FFA500"
            flexDirection="column"
            height={Math.min(options.length * 2 + 2, 14)}
          >
            <select
              options={options}
              selectedIndex={selectedIndex}
              focused={false}
              flexGrow={1}
              width="100%"
              backgroundColor="transparent"
              textColor="#FFA500"
              focusedBackgroundColor="#1a1a2e"
              focusedTextColor="#FFD700"
              selectedBackgroundColor="#FFA500"
              selectedTextColor="#000000"
              descriptionColor="#996600"
              selectedDescriptionColor="#1a1a2e"
              showDescription={false}
              wrapSelection={true}
            />
          </box>
        )}

        {!isLoading && debouncedQuery.length >= 2 && !hasResults && (
          <box>
            <text fg="#996600">No airports found</text>
          </box>
        )}
      </box>

      <box marginTop={2}>
        <text fg="#996600">
          [↑↓] Navigate  [Enter] Select  [Type] Search
        </text>
      </box>
    </box>
  );
}
