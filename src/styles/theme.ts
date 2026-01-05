/**
 * Theme configuration
 *
 * Amber/Orange CRT aesthetic color palette with lazygit-inspired styling.
 */

export const colors = {
  // primary amber/orange tones
  primary: "#FF8C00",
  secondary: "#FFA500",
  accent: "#FFD700",

  // background colors
  background: "#0A0A0A",
  backgroundAlt: "#141414",
  backgroundHighlight: "#1E1E1E",

  // text colors
  text: "#FFA500",
  textDim: "#8B5A00",
  textBright: "#FFD700",
  textMuted: "#6B4400",

  // border colors
  border: "#CC7000",
  borderActive: "#FFA500",
  borderFocused: "#FFD700",

  // status colors - flight specific
  statusScheduled: "#FFA500",
  statusActive: "#FFD700",
  statusLanded: "#8B5A00",
  statusCancelled: "#FF4500",
  statusDelayed: "#FF6600",

  // ui state colors
  success: "#FFD700",
  warning: "#FF6600",
  error: "#FF4500",
  info: "#FFA500",
} as const;

// table drawing characters (box-drawing unicode)
export const tableChars = {
  // single line
  horizontal: "─",
  vertical: "│",
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  teeRight: "├",
  teeLeft: "┤",
  teeDown: "┬",
  teeUp: "┴",
  cross: "┼",
} as const;

// column widths for departures table
export const columnWidths = {
  time: 7,
  flight: 8,
  destination: 10,
  terminal: 5,
  gate: 5,
  arrivalTime: 7,
  duration: 6,
  status: 12,
} as const;

export const layout = {
  minWidth: 80,
  minHeight: 24,
  padding: 1,
  margin: 1,
} as const;
