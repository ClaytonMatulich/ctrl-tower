/**
 * Theme configuration
 * 
 * Amber/Orange CRT aesthetic color palette and styling constants.
 * Inspired by vintage airport terminals and 1970s-80s CRT monitors.
 */

export const colors = {
  // Primary amber/orange tones (inspired by CRT phosphor)
  primary: '#FF8C00',         // Dark Orange - main UI color
  secondary: '#FFA500',       // Orange - standard text
  accent: '#FFD700',          // Gold - highlights and important elements
  
  // Background colors (dark for CRT contrast)
  background: '#0A0A0A',      // Almost black - main background
  backgroundAlt: '#1A1A1A',   // Slightly lighter - for panels
  backgroundDark: '#000000',  // Pure black - for depth
  
  // Text colors
  text: '#FFA500',            // Orange - standard text
  textDim: '#CC7000',         // Dimmed orange - secondary text
  textBright: '#FFBB33',      // Bright orange - emphasized text
  textMuted: '#996600',       // Muted orange - disabled/inactive
  
  // Status colors (all amber-toned to maintain aesthetic)
  success: '#FFD700',         // Gold - successful operations
  warning: '#FF6600',         // Dark orange - warnings
  error: '#FF4500',           // Orange red - errors
  info: '#FFA500',            // Standard orange - information
  active: '#FFBB33',          // Bright orange - active states
  
  // Split-flap mechanical board colors
  flapBackground: '#2A2A2A',  // Dark gray - flap background
  flapText: '#FFA500',        // Orange - flap text
  flapBorder: '#4A4A2A',      // Olive-gray - borders between flaps
  
  // CRT effects
  scanLine: '#000000',        // Black - scan lines (use with opacity)
  glow: '#FF8C00',            // Orange glow - phosphor bloom effect
  
  // Map colors
  mapLand: '#1A1A0A',         // Very dark olive - land masses
  mapWater: '#0A0A0A',        // Pure background - water
  mapBorder: '#332200',       // Dark brown - borders
  mapAircraft: '#FFD700',     // Gold - aircraft markers
  mapSelected: '#FFBB33',     // Bright - selected aircraft
} as const;

/**
 * Layout constants
 */
export const layout = {
  // Terminal dimensions (characters)
  minWidth: 80,
  minHeight: 24,
  idealWidth: 120,
  idealHeight: 40,
  
  // Component spacing
  padding: 1,
  margin: 1,
  borderWidth: 1,
  
  // Header/Footer/Tab dimensions
  headerHeight: 3,
  footerHeight: 2,
  tabBarHeight: 3,
  tabWidth: 15,
  
  // Content area (calculated from terminal height)
  getContentHeight: (terminalHeight: number) => {
    return terminalHeight - layout.headerHeight - layout.footerHeight - layout.tabBarHeight;
  },
} as const;

/**
 * Box-drawing characters for borders
 */
export const boxChars = {
  // Single-line box drawing
  horizontal: '─',
  vertical: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  teeLeft: '├',
  teeRight: '┤',
  teeUp: '┴',
  teeDown: '┬',
  cross: '┼',
  
  // Double-line box drawing (for emphasis)
  horizontalDouble: '═',
  verticalDouble: '║',
  topLeftDouble: '╔',
  topRightDouble: '╗',
  bottomLeftDouble: '╚',
  bottomRightDouble: '╝',
  teeLeftDouble: '╠',
  teeRightDouble: '╣',
  teeUpDouble: '╩',
  teeDownDouble: '╦',
  crossDouble: '╬',
} as const;

/**
 * Aircraft symbols based on heading
 */
export const aircraftSymbols = {
  // Directional arrows
  north: '▲',
  northeast: '◥',
  east: '►',
  southeast: '◢',
  south: '▼',
  southwest: '◣',
  west: '◄',
  northwest: '◤',
  
  // Alternative symbols
  generic: '✈',
  selected: '◆',
  onGround: '●',
} as const;

/**
 * Status indicators
 */
export const statusSymbols = {
  scheduled: '✓',
  boarding: '►',
  departed: '◆',
  active: '→',
  landed: '◆',
  delayed: '⏱',
  cancelled: '✗',
  diverted: '↻',
} as const;

/**
 * Animation configuration
 */
export const animation = {
  // Frame timings (ms)
  targetFPS: 60,
  frameTime: 1000 / 60, // ~16.67ms per frame
  
  // Split-flap animation
  splitFlapDuration: 400, // ms for full flip
  splitFlapFrames: 5, // number of frames in flip animation
  
  // CRT effects
  scanLineSpeed: 2, // pixels per frame
  scanLineOpacity: 0.5,
  glowIntensity: 0.3,
  flickerChance: 0.05, // 5% chance per frame
  flickerIntensity: 0.1,
  
  // Smooth transitions
  easingFunction: 'ease-in-out',
  transitionDuration: 200, // ms
} as const;

/**
 * Typography
 */
export const typography = {
  // Font styles (for reference; actual rendering uses terminal font)
  fontFamily: 'monospace',
  
  // Text sizes (in lines/columns, not pixels)
  header: {
    height: 3,
  },
  body: {
    lineHeight: 1,
  },
  small: {
    // Rendered using regular size but with dimmed color
  },
} as const;

/**
 * Helper function to get aircraft symbol based on heading
 */
export function getAircraftSymbol(heading: number, onGround: boolean = false): string {
  if (onGround) return aircraftSymbols.onGround;
  
  // Normalize heading to 0-359
  const normalizedHeading = ((heading % 360) + 360) % 360;
  
  // 8-directional symbols (45° each)
  if (normalizedHeading >= 337.5 || normalizedHeading < 22.5) return aircraftSymbols.north;
  if (normalizedHeading >= 22.5 && normalizedHeading < 67.5) return aircraftSymbols.northeast;
  if (normalizedHeading >= 67.5 && normalizedHeading < 112.5) return aircraftSymbols.east;
  if (normalizedHeading >= 112.5 && normalizedHeading < 157.5) return aircraftSymbols.southeast;
  if (normalizedHeading >= 157.5 && normalizedHeading < 202.5) return aircraftSymbols.south;
  if (normalizedHeading >= 202.5 && normalizedHeading < 247.5) return aircraftSymbols.southwest;
  if (normalizedHeading >= 247.5 && normalizedHeading < 292.5) return aircraftSymbols.west;
  return aircraftSymbols.northwest;
}

/**
 * Helper function to get status symbol
 */
export function getStatusSymbol(status: string): string {
  return statusSymbols[status as keyof typeof statusSymbols] ?? '?';
}

/**
 * Helper function to get status color
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return colors.text;
    case 'boarding':
      return colors.active;
    case 'departed':
    case 'active':
      return colors.success;
    case 'landed':
      return colors.textDim;
    case 'delayed':
      return colors.warning;
    case 'cancelled':
      return colors.error;
    default:
      return colors.text;
  }
}
