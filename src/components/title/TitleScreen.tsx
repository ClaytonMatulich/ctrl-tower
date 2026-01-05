import { useKeyboard } from "@opentui/react";
import { colors } from "../../styles/theme";

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
      <box
        border
        borderStyle="rounded"
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        borderColor={colors.border}
      >
        <box flexDirection="column" alignItems="center">
          <ascii-font text="CTRL-TOWER" font="block" color={colors.secondary} />
          <box marginTop={1}>
            <text fg={colors.textDim}>Flight Information System</text>
          </box>
          <box marginTop={1}>
            <text fg={colors.textMuted}>v0.1.0</text>
          </box>
        </box>
      </box>

      <box marginTop={2}>
        <text fg={colors.accent}>Press any key to continue</text>
      </box>
    </box>
  );
}
