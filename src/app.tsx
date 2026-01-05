import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TitleScreen } from "./components/title/TitleScreen";
import { AirportSearch } from "./components/airport/AirportSearch";
import { MainApp } from "./components/main/MainApp";
import type { SelectedAirport } from "./types/airport";

// create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

type AppScreen = "title" | "airport-search" | "main";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("title");
  const [selectedAirport, setSelectedAirport] = useState<SelectedAirport | null>(null);

  function handleTitleComplete() {
    setScreen("airport-search");
  }

  function handleAirportSelect(airport: SelectedAirport) {
    setSelectedAirport(airport);
    setScreen("main");
  }

  function handleBackToSearch() {
    setScreen("airport-search");
  }

  if (screen === "title") {
    return <TitleScreen onComplete={handleTitleComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {screen === "airport-search" && (
        <AirportSearch onSelect={handleAirportSelect} />
      )}
      {screen === "main" && selectedAirport && (
        <MainApp airport={selectedAirport} onChangeAirport={handleBackToSearch} />
      )}
    </QueryClientProvider>
  );
}
