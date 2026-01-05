import { useState, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { DeparturesBoard } from "../departures/DeparturesBoard";
import type { SelectedAirport } from "../../types/airport";

interface MainAppProps {
  airport: SelectedAirport;
  onChangeAirport: () => void;
}

export function MainApp({ airport, onChangeAirport }: MainAppProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const tabs = [
    { key: "departures", label: "DEPARTURES", shortcut: "1" },
    { key: "arrivals", label: "ARRIVALS", shortcut: "2" },
    { key: "help", label: "HELP", shortcut: "3" },
  ];

  // update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useKeyboard((key) => {
    if (key.name === "tab") {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    } else if (key.name === "1") {
      setActiveTab(0);
    } else if (key.name === "2") {
      setActiveTab(1);
    } else if (key.name === "3") {
      setActiveTab(2);
    } else if (key.name === "escape") {
      onChangeAirport();
    }
  });

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <box flexDirection="column" height="100%">
      {/* header */}
      <box
        height={3}
        border
        flexDirection="column"
        paddingLeft={1}
        paddingRight={1}
      >
        <box flexDirection="row" justifyContent="space-between">
          <text fg="#FFD700">Ctrl-Tower v0.1.0</text>
          <text fg="#FFA500">
            {airport.code} - {airport.name}
          </text>
          <text fg="#CC7000">{timeStr} UTC</text>
        </box>
        <box flexDirection="row" marginTop={1}>
          {tabs.map((tab, i) => (
            <box key={tab.key} marginRight={2}>
              <text fg={activeTab === i ? "#FFD700" : "#996600"}>
                [{tab.shortcut}]
              </text>
              <text fg={activeTab === i ? "#FFD700" : "#996600"}>
                {activeTab === i ? "◄ " : " "}
              </text>
              <text fg={activeTab === i ? "#FFD700" : "#996600"}>
                {tab.label}
              </text>
              <text fg={activeTab === i ? "#FFD700" : "#996600"}>
                {activeTab === i ? " ►" : ""}
              </text>
            </box>
          ))}
        </box>
      </box>

      {/* content */}
      <box flexDirection="column" flexGrow={1}>
        {activeTab === 0 && <DeparturesBoard airportCode={airport.code} />}
        {activeTab === 1 && (
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
                <text fg="#FFA500">ARRIVALS - Coming Soon</text>
                <box marginTop={1}>
                  <text fg="#996600">
                    Arrivals board will be available in a future update
                  </text>
                </box>
              </box>
            </box>
          </box>
        )}
        {activeTab === 2 && (
          <box flexDirection="column" height="100%" padding={2}>
            <box border borderStyle="single" borderColor="#FFA500" padding={1}>
              <box flexDirection="column" padding={1}>
                <text fg="#FFD700">Keyboard Shortcuts</text>
                <box marginTop={1} flexDirection="column">
                  <text fg="#FFA500">[Tab] Switch tabs forward</text>
                  <text fg="#FFA500">[1-3] Jump to specific tab</text>
                  <text fg="#FFA500">[R] Refresh departures data</text>
                  <text fg="#FFA500">[←][→] Navigate pages</text>
                  <text fg="#FFA500">[Esc] Change airport</text>
                  <text fg="#FFA500">[Q] Quit application</text>
                </box>
              </box>
            </box>
          </box>
        )}
      </box>

      {/* footer */}
      <box height={2} border paddingLeft={1} paddingRight={1}>
        <text fg="#996600">
          [Tab] Switch Tabs  [1-3] Jump  [Esc] Change Airport  [Q] Quit
        </text>
      </box>
    </box>
  );
}
