import { useKeyboard } from "@opentui/react";

interface TitleScreenProps {
  onComplete: () => void;
}

export function TitleScreen({ onComplete }: TitleScreenProps) {
  useKeyboard(
    () => {
      onComplete();
    },
    { release: true }
  );

  return (
    <box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <box border borderStyle="double" padding={1} borderColor="#FFA500">
        <box flexDirection="column" alignItems="center">
          <ascii-font text="CTRL-TOWER" font="block" color="#FFA500" />
          <box marginTop={1} marginBottom={1}>
            <text fg="#FFA500">FLIGHT INFORMATION SYSTEM</text>
          </box>
          <box paddingLeft={2} paddingRight={2}>
            <text fg="#FFA500">Version 0.1.0</text>
          </box>
        </box>
      </box>

      <box marginTop={2}>
        <text fg="#FFD700">Press any key to continue...</text>
      </box>
    </box>
  );
}
