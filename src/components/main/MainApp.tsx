import { useState } from 'react';
import { useKeyboard } from '@opentui/react';

export function MainApp() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { key: 'arrivals', label: 'ARRIVALS', shortcut: '1' },
    { key: 'departures', label: 'DEPARTURES', shortcut: '2' },
    { key: 'map', label: 'LIVE MAP', shortcut: '3' },
    { key: 'help', label: 'HELP', shortcut: '4' },
  ];

  useKeyboard((key) => {
    if (key.name === 'tab') {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    } else if (key.name === '1') {
      setActiveTab(0);
    } else if (key.name === '2') {
      setActiveTab(1);
    } else if (key.name === '3') {
      setActiveTab(2);
    } else if (key.name === '4') {
      setActiveTab(3);
    }
  });

  return (
    <box
      flexDirection="column"
      height="100%"
    >
      <box
        height={3}
        border
        flexDirection="column"
        paddingLeft={1}
        paddingRight={1}
      >
        <box flexDirection="row" justifyContent="space-between">
          <text fg="#FFD700">Ctrl-Tower v0.1.0</text>
          <text fg="#FFA500">SFO - San Francisco International</text>
          <text fg="#CC7000">19:45:32 UTC</text>
        </box>
        <box flexDirection="row" marginTop={1}>
          {tabs.map((tab, i) => (
            <box key={tab.key} marginRight={2}>
              <text fg={activeTab === i ? '#FFD700' : '#996600'}>
                [{tab.shortcut}]
              </text>
              <text fg={activeTab === i ? '#FFD700' : '#996600'}>
                {activeTab === i ? '◄ ' : ''}
              </text>
              <text fg={activeTab === i ? '#FFD700' : '#996600'}>
                {tab.label}
              </text>
              <text fg={activeTab === i ? '#FFD700' : '#996600'}>
                {activeTab === i ? ' ►' : ''}
              </text>
            </box>
          ))}
        </box>
      </box>

      <box flexDirection="column" flexGrow={1} padding={1}>
        {activeTab === 0 && (
          <box flexDirection="column" height="100%">
            <text fg="#FFA500">ARRIVALS - SFO (San Francisco International)</text>
            <box border marginTop={1} flexDirection="column">
              <text fg="#996600">Loading flight data...</text>
            </box>
          </box>
        )}
        {activeTab === 1 && (
          <box flexDirection="column" height="100%">
            <text fg="#FFA500">DEPARTURES - SFO (San Francisco International)</text>
            <box border marginTop={1} flexDirection="column">
              <text fg="#996600">Loading flight data...</text>
            </box>
          </box>
        )}
        {activeTab === 2 && (
          <box flexDirection="column" height="100%">
            <text fg="#FFA500">LIVE MAP - Regional (300km radius from SFO)</text>
            <box border marginTop={1} flexDirection="column">
              <text fg="#996600">Loading aircraft positions...</text>
            </box>
          </box>
        )}
        {activeTab === 3 && (
          <box flexDirection="column" height="100%">
            <text fg="#FFD700">Keyboard Shortcuts</text>
            <box marginTop={1} flexDirection="column">
              <text fg="#FFA500">[Tab] Switch tabs forward</text>
              <text fg="#FFA500">[Shift+Tab] Switch tabs backward</text>
              <text fg="#FFA500">[1-4] Jump to tab</text>
              <text fg="#FFA500">[↑/↓] Navigate within lists</text>
              <text fg="#FFA500">[Enter] Select flight/aircraft</text>
              <text fg="#FFA500">[Esc] Go back / close detail</text>
              <text fg="#FFA500">[M] Toggle map mode</text>
              <text fg="#FFA500">[R] Refresh data</text>
              <text fg="#FFA500">[Q] Quit application</text>
            </box>
          </box>
        )}
      </box>

      <box
        height={2}
        border
        paddingLeft={1}
        paddingRight={1}
      >
        <text fg="#996600">
          [R] Refresh  [Q] Quit  API: AirLabs (SFO)  OpenSky (0 aircraft)
        </text>
      </box>
    </box>
  );
}
