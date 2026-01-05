# Ctrl-Tower Specification

**Version:** 0.1.0  
**Last Updated:** January 4, 2026

> A retro-style TUI for real-time flight departures with amber CRT aesthetics

---

## Overview

**ctrl-tower** is a terminal user interface (TUI) application displaying real-time flight information. Inspired by classic airport departure boards and amber CRT monitors, it combines retro aesthetics with modern React architecture.

### Design Philosophy

- **Visual Inspiration:** Classic split-flap boards, amber CRT terminals
- **TUI Inspiration:** [lazygit](https://github.com/jesseduffield/lazygit), [opencode](https://github.com/opencode-ai/opencode)
  - Clean bordered panels with titles
  - Fixed-width columns with visual separators
  - Minimal chrome, maximum information density
  - Contextual help in footer
- **Color Scheme:** Amber/orange tones (#FFA500) with dimmed secondary text
- **Type Safety:** Strict TypeScript with Zod runtime validation

---

## Tech Stack

| Technology                | Purpose                        |
| ------------------------- | ------------------------------ |
| **Bun**                   | Runtime & package manager      |
| **TypeScript**            | Type-safe development          |
| **React** 19+             | UI framework                   |
| **@opentui/react**        | React reconciler for terminals |
| **@opentui/core**         | Terminal rendering primitives  |
| **@tanstack/react-query** | Data fetching & caching        |
| **Zod**                   | Runtime type validation        |

### Prerequisites

- Zig compiler (for @opentui builds)
- Bun runtime
- AirLabs API key (free tier: 10k/month)

---

## OpenTUI Components & Utilities

### Built-in Components

```tsx
// layout containers
<box />              // flexbox-based layout container
<scrollbox />        // scrollable container with scrollbars

// text & input
<text />             // styled text with color/formatting
<input />            // single-line text input
<textarea />         // multi-line text input
<ascii-font />       // ASCII art text in various fonts

// interactive
<select />           // list selection with keyboard nav
<tab-select />       // tab-based navigation component

// formatting
<b>, <i>, <u>        // text modifiers (bold, italic, underline)
<strong>, <em>       // semantic text emphasis
<br />               // line break
```

### Common Props

```tsx
// flexbox layout (yoga-layout)
flexDirection="row" | "column"
justifyContent="flex-start" | "center" | "space-between" | ...
alignItems="flex-start" | "center" | "stretch" | ...
flexGrow={1}
gap={1}

// borders & styling
border={true | ["top", "bottom", "left", "right"]}
borderStyle="single" | "double" | "rounded" | "heavy"
borderColor="#FFA500"
title="Panel Title"
titleAlignment="left" | "center" | "right"
backgroundColor="#000"

// spacing
padding={1}
paddingLeft={1} paddingRight={1} paddingTop={1} paddingBottom={1}
margin={1}
marginLeft={1} marginRight={1} marginTop={1} marginBottom={1}

// dimensions
width={80} | "100%"
height={24} | "100%"

// text styling
fg="#FFA500"        // foreground color
```

### Hooks

```tsx
import { useKeyboard, useTerminalDimensions } from "@opentui/react";

// keyboard input handling
useKeyboard((key) => {
  if (key.name === "escape") {
    /* ... */
  }
});

// terminal size
const { width, height } = useTerminalDimensions();
```

### Key Event Properties

```tsx
key.name; // "escape", "return", "up", "down", "left", "right", "tab", etc.
key.ctrl; // boolean
key.shift; // boolean
key.meta; // boolean
key.sequence; // raw key sequence
```

---

## Features

### Current (v0.1.0)

- **Title Screen:** ASCII art logo, press any key to continue
- **Airport Search:** Search and select airports
- **Departures Board:** Real-time departures with fixed-width table
  - Columns: Time, Flight, Destination, Gate, Status
  - Manual refresh (R key)
  - Pagination (10 flights/page)
  - Status colors: scheduled, active, landed, cancelled
- **Tab Navigation:** Departures / Arrivals / Help
- **Clean UI:** Rounded borders, titled panels, contextual shortcuts

---

## Architecture

```
src/
├── components/
│   ├── title/          # Title screen
│   ├── airport/        # Airport search
│   ├── main/           # Main app & tabs
│   └── departures/     # Departures board & rows
├── services/
│   └── airlabs.ts      # AirLabs API client
├── types/
│   ├── api/            # Zod schemas for API validation
│   ├── flight.ts       # Flight domain types
│   └── airport.ts      # Airport types
├── utils/
│   ├── time.ts         # Timezone & formatting
│   └── logger.ts       # Logging utility
├── styles/
│   └── theme.ts        # Colors, table chars, column widths
└── constants/
    └── config.ts       # Environment config
```

### Data Flow

```
AirLabs API → Zod Validation → Domain Types → TanStack Query Cache → React Components
```

### Design Principles

1. **Manual Refresh Only:** Conserve API calls (no auto-refetch)
2. **Type Safety:** Zod at API boundary, strict TypeScript throughout
3. **Component Isolation:** Self-contained, reusable components
4. **Theme Constants:** Centralized colors, widths, characters in `theme.ts`
5. **Fixed-Width Tables:** Use box widths, not string padding

---

## API Integration

### AirLabs API

**Endpoints:**

```
Departures: GET /schedules?dep_iata={CODE}
Arrivals:   GET /schedules?arr_iata={CODE}
Search:     GET /suggest?q={QUERY}
```

**Rate Limits:** 10,000 requests/month (free tier)

**Validation Flow:**

```typescript
API Response → Zod Schema → Type-safe Domain Model
```

**Status Mapping:**

| API Status  | Display Status |
| ----------- | -------------- |
| `scheduled` | ON TIME        |
| `active`    | DEPARTED       |
| `landed`    | LANDED         |
| `cancelled` | CANCELLED      |

---

## Data Models

### Flight Type

```typescript
type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
  destination: string;
  destinationCode: string;
  scheduledTime: Date;
  estimatedTime: Date | null;
  gate: string | null;
  terminal: string | null;
  status: "scheduled" | "cancelled" | "active" | "landed" | null;
  delayMinutes: number | null;
};
```

### API Validation (Zod)

- `AirLabsScheduleSchema` - Single flight
- `AirLabsSchedulesResponseSchema` - Full response
- `AirLabsAirportSuggestionSchema` - Airport search

---

## Configuration

### Environment Variables

```bash
AIRLABS_API_KEY=your_api_key_here
```

### Theme Constants (`src/styles/theme.ts`)

```typescript
colors: {
  primary, secondary, accent,
  text, textDim, textBright, textMuted,
  border, borderActive, borderFocused,
  statusScheduled, statusActive, statusLanded, statusCancelled
}

tableChars: {
  horizontal, vertical, topLeft, topRight, ...
}

columnWidths: {
  time: 7, flight: 10, destination: 24, gate: 6, status: 12
}
```

### Query Config

```typescript
staleTime: Infinity           // never auto-refetch
gcTime: 10 minutes            // cache for 10min
refetchOnWindowFocus: false   // manual refresh only
```

---

## Development

### Setup

```bash
bun install
cp .env.example .env
# Add AIRLABS_API_KEY to .env
bun run dev
```

### Keyboard Shortcuts

| Key     | Action                    | Context        |
| ------- | ------------------------- | -------------- |
| Any key | Continue                  | Title screen   |
| Tab     | Next tab                  | Main app       |
| 1, 2, ? | Jump to tab               | Main app       |
| R       | Refresh data              | Departures     |
| ← / →   | Page navigation           | Departures     |
| ↑ / ↓   | Navigate list             | Airport search |
| Enter   | Select                    | Airport search |
| Esc     | Back to airport selection | Main app       |
| Q       | Quit                      | Anywhere       |

---

## Future Enhancements

### Planned Features

- **Arrivals Board:** Mirror of departures using `/schedules?arr_iata=`
- **Split-Flap Animation:** Mechanical board effect for updates
- **CRT Effects:** Scan lines, glow, color themes (amber/green/white)
- **Live Map:** OpenSky Network integration with ASCII world map
- **Flight Details:** Expanded info panel for selected flights
- **Search/Filter:** Text search within current flights
- **Auto-Refresh:** Optional toggle for live updates

### Technical Improvements

- Full airport name resolution
- Unit & integration tests
- Performance profiling
- Better error recovery

---

## Development Notes

- **Design First:** Use lazygit/opencode as UI references
- **Manual Refresh:** Default to conserve API calls
- **Type Safety:** Zod at boundaries, strict TypeScript everywhere
- **Theme Constants:** Never hardcode colors or widths
- **Fixed Widths:** Use `width={N}` props, not string padding
- **Border Titles:** Use `title` prop instead of separate header text
- **No Default Exports:** Named exports only

---

**Questions?** Open an issue or PR.
