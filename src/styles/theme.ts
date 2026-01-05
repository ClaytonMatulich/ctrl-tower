/**
 * Theme configuration
 *
 * Amber/Orange CRT aesthetic color palette.
 */

export const colors = {
  // primary amber/orange tones
  primary: "#FF8C00",
  secondary: "#FFA500",
  accent: "#FFD700",

  // background colors
  background: "#0A0A0A",
  backgroundAlt: "#1A1A1A",

  // text colors
  text: "#FFA500",
  textDim: "#CC7000",
  textBright: "#FFBB33",
  textMuted: "#996600",

  // status colors
  success: "#FFD700",
  warning: "#FF6600",
  error: "#FF4500",
  info: "#FFA500",
} as const;

export const layout = {
  minWidth: 80,
  minHeight: 24,
  padding: 1,
  margin: 1,
} as const;
