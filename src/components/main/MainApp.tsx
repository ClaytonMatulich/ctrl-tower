import { useState, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { DeparturesBoard } from "../departures/DeparturesBoard";
import { colors } from "../../styles/theme";
import type { SelectedAirport } from "../../types/airport";

interface MainAppProps {
  airport: SelectedAirport;
  onChangeAirport: () => void;
}

type TabKey = "departures" | "arrivals" | "help";

interface Tab {
  key: TabKey;
  label: string;
  shortcut: string;
}

const tabs: Tab[] = [
  { key: "departures", label: "Departures", shortcut: "1" },
  { key: "arrivals", label: "Arrivals", shortcut: "2" },
  { key: "help", label: "Help", shortcut: "?" },
];

// contextual shortcuts for each tab
const tabShortcuts: Record<TabKey, string> = {
  departures: "[R] Refresh  [←→] Page  [Esc] Airport  [Q] Quit",
  arrivals: "[Esc] Airport  [Q] Quit",
  help: "[Esc] Airport  [Q] Quit",
};

export function MainApp({ airport, onChangeAirport }: MainAppProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    } else if (key.name === "3" || key.name === "?") {
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

  // activeTab is always in bounds due to modular arithmetic in keyboard handler
  const currentTab = tabs[activeTab]!;

  return (
    <box flexDirection="column" height="100%">
      {/* header bar */}
      <box
        height={1}
        flexDirection="row"
        justifyContent="space-between"
        paddingLeft={1}
        paddingRight={1}
      >
        <text fg={colors.accent}>ctrl-tower</text>
        <text fg={colors.text}>
          {airport.code} │ {airport.name}
        </text>
        <text fg={colors.textDim}>{timeStr}</text>
      </box>

      {/* tab bar */}
      <box
        height={1}
        flexDirection="row"
        paddingLeft={1}
        borderColor={colors.border}
        border={["bottom"]}
      >
        {tabs.map((tab, i) => (
          <box key={tab.key} marginRight={1}>
            <text fg={activeTab === i ? colors.accent : colors.textDim}>
              {activeTab === i ? "▸" : " "}
            </text>
            <text fg={activeTab === i ? colors.textBright : colors.textDim}>
              [{tab.shortcut}]
            </text>
            <text fg={activeTab === i ? colors.textBright : colors.textMuted}>
              {" "}
              {tab.label}
            </text>
          </box>
        ))}
      </box>

      {/* content area */}
      <box flexDirection="column" flexGrow={1}>
        {activeTab === 0 && <DeparturesBoard airportCode={airport.code} />}
        {activeTab === 1 && (
          <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
            <box
              border
              borderStyle="rounded"
              borderColor={colors.border}
              height="100%"
              title=" Arrivals "
              titleAlignment="left"
            >
              <box
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <text fg={colors.textDim}>Coming Soon</text>
                <box marginTop={1}>
                  <text fg={colors.textMuted}>
                    Arrivals board will be available in a future update
                  </text>
                </box>
              </box>
            </box>
          </box>
        )}
        {activeTab === 2 && (
          <box flexDirection="column" height="100%" paddingTop={1} paddingLeft={1} paddingRight={1}>
            <box
              border
              borderStyle="rounded"
              borderColor={colors.border}
              title=" Keyboard Shortcuts "
              titleAlignment="left"
              paddingLeft={1}
              paddingTop={1}
            >
              <box flexDirection="column">
                <box flexDirection="row" marginBottom={1}>
                  <text fg={colors.accent} width={16}>Tab</text>
                  <text fg={colors.text}>Switch tabs</text>
                </box>
                <box flexDirection="row" marginBottom={1}>
                  <text fg={colors.accent} width={16}>1 / 2 / ?</text>
                  <text fg={colors.text}>Jump to tab</text>
                </box>
                <box flexDirection="row" marginBottom={1}>
                  <text fg={colors.accent} width={16}>R</text>
                  <text fg={colors.text}>Refresh data</text>
                </box>
                <box flexDirection="row" marginBottom={1}>
                  <text fg={colors.accent} width={16}>← / →</text>
                  <text fg={colors.text}>Navigate pages</text>
                </box>
                <box flexDirection="row" marginBottom={1}>
                  <text fg={colors.accent} width={16}>Esc</text>
                  <text fg={colors.text}>Change airport</text>
                </box>
                <box flexDirection="row">
                  <text fg={colors.accent} width={16}>Q</text>
                  <text fg={colors.text}>Quit application</text>
                </box>
              </box>
            </box>
          </box>
        )}
      </box>

      {/* footer with contextual shortcuts */}
      <box
        height={2}
        paddingLeft={1}
        paddingRight={1}
        borderColor={colors.border}
        border={["top"]}
      >
        <text fg={colors.text}>
          {tabShortcuts[currentTab.key]}
        </text>
      </box>
    </box>
  );
}
