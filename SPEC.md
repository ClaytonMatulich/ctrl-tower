# Ctrl-Tower Specification

**Version:** 0.1.0 (MVP)  
**Last Updated:** January 4, 2026  
**Status:** Active Development

> **Living Document:** This specification serves as the single source of truth for the ctrl-tower MVP. All architectural decisions, technical requirements, and project goals are documented here.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [MVP Scope](#3-mvp-scope)
4. [Architecture](#4-architecture)
5. [API Integration](#5-api-integration)
6. [Data Models](#6-data-models)
7. [Configuration](#7-configuration)
8. [Development Setup](#8-development-setup)
9. [Future Enhancements](#9-future-enhancements)

---

## 1. Project Overview

### Vision

**ctrl-tower** is a retro-style terminal user interface (TUI) application for viewing real-time flight departures. Inspired by classic split-flap airport departure boards and amber CRT monitors, it provides a beautiful terminal-based flight information display.

### Core Objectives

- **Retro Aesthetic:** Amber/orange CRT display with clean typography
- **Real-Time Data:** Live flight departure information
- **Simplicity:** Focused MVP with room to grow
- **Type Safety:** Fully type-safe TypeScript codebase
- **Performance:** Optimized for API usage and smooth rendering

### Default Configuration

- **Default Airport:** SFO (San Francisco International Airport)
- **Time Display:** Local airport time (PST/PDT for SFO)
- **Pagination:** 10 flights per page

---

## 2. Tech Stack

### Core Technologies

| Technology                | Version | Purpose                   |
| ------------------------- | ------- | ------------------------- |
| **Bun**                   | 1.1.26+ | Runtime & package manager |
| **TypeScript**            | 5.0+    | Type-safe development     |
| **@opentui/react**        | 0.1.68+ | React reconciler for TUI  |
| **@opentui/core**         | 0.1.68+ | Core TUI primitives       |
| **React**                 | 19.2.3+ | UI framework              |
| **@tanstack/react-query** | 5.90+   | Data fetching & caching   |
| **Zod**                   | 4.3.4+  | Runtime type validation   |

### Prerequisites

- Zig compiler (required for building @opentui packages)
- Bun installed globally
- AirLabs API key (free tier: 10,000 requests/month)

### Type Safety Philosophy

- **Strict TypeScript:** All compiler strictness flags enabled
- **Runtime Validation:** Zod schemas for API responses
- **No `any` types:** Explicit types throughout
- **Types over Interfaces:** Use `type` instead of `interface` for consistency

---

## 3. MVP Scope

### ✅ Completed Features

1. **Title Screen**
   - ASCII art logo
   - "Press any key to continue" interaction
   - Retro amber/orange color scheme

### 🚧 Current Development

2. **Departures Board**
   - Real-time flight departure information from SFO
   - Display: Time, Flight Number, Destination, Gate, Status
   - Manual refresh (R key) to conserve API calls
   - Pagination: 10 flights per page with arrow key navigation
   - Time filtering: Shows flights departing in next 12 hours
   - Local time display (PST for SFO)
   - Status color coding:
     - Orange: Scheduled, Boarding, Departed
     - Red: Delayed, Cancelled

### 🎯 MVP Success Criteria

- Title screen transitions to main app
- Departures board shows live SFO departures
- Manual refresh updates data
- Pagination works with keyboard shortcuts
- Error handling for API failures
- Clean, retro visual aesthetic

---

## 4. Architecture

### High-Level Structure

```
ctrl-tower/
├── src/
│   ├── components/          # React components
│   │   ├── title/          # Title screen
│   │   ├── main/           # Main app wrapper
│   │   └── departures/     # Departures board components
│   ├── services/           # API clients
│   │   └── airlabs.ts     # AirLabs API integration
│   ├── types/              # TypeScript types
│   │   ├── api/           # API response types (Zod schemas)
│   │   └── flight.ts      # Domain types
│   ├── utils/              # Utility functions
│   │   └── time.ts        # Timezone & formatting utilities
│   ├── constants/          # Configuration constants
│   │   └── config.ts      # Environment-based config
│   ├── app.tsx            # Root app component
│   └── index.tsx          # Entry point
├── .env                    # Environment variables (gitignored)
├── .env.example            # Example environment file
└── package.json
```

### Design Principles

1. **Component Isolation:** Each component is self-contained
2. **Type Safety:** API boundary → Zod validation → Domain types
3. **Data Flow:** TanStack Query handles fetching, caching, error states
4. **No Auto-Refresh:** Manual refresh only to conserve API calls
5. **OpenTUI Primitives:** Use built-in `<box>`, `<text>`, `<ascii-font>` components

### Key Components

**TitleScreen.tsx**

- Displays logo and welcome message
- Waits for any keypress
- Transitions to MainApp

**MainApp.tsx**

- Tab navigation wrapper
- Keyboard shortcut handling (1-4 for tabs, Tab to cycle)
- Shows DeparturesBoard in tab 1

**DeparturesBoard.tsx**

- Uses TanStack Query to fetch departures
- Manual refresh with R key
- Pagination with arrow keys or [ ]
- Loading, error, and empty states
- Display flights in table format

**DepartureRow.tsx**

- Individual flight row display
- Status color coding
- Formatted time, destination, gate, status

---

## 5. API Integration

### AirLabs API

**Endpoint Used:**

```
GET https://airlabs.co/api/v9/schedules?dep_iata=SFO&api_key={key}
```

**Rate Limits:**

- Free tier: 10,000 requests/month
- ~333 requests/day safely
- Manual refresh strategy keeps usage low

**Response Validation:**

- Zod schema: `AirLabsSchedulesResponseSchema`
- Runtime type checking ensures data integrity
- Graceful error handling for malformed responses

**Data Mapping:**

```
AirLabs API Response → Zod Validation → Domain Flight Type
```

**Status Mapping:**

- `scheduled` → scheduled (no delays)
- `active` + close to departure → boarding
- `active` + past departure → departed
- `landed` → departed (for departures board)
- `cancelled` → cancelled
- Any with `dep_delayed > 0` → delayed

**Time Handling:**

- API returns UTC times
- Convert to local airport timezone (PST/PDT for SFO)
- Display in 24-hour format: "19:30"
- Filter to next 12 hours from current time

---

## 6. Data Models

### Domain Types (src/types/flight.ts)

```typescript
// Core flight model
type Flight = {
  id: string; // Unique ID
  flightNumber: string; // e.g., "AA2421"
  airline: string; // IATA code
  destination: string; // IATA code (for now)
  destinationCode: string; // IATA code
  scheduledTime: Date; // Scheduled departure
  estimatedTime: Date | null; // Estimated departure
  gate: string | null; // Gate number
  terminal: string | null; // Terminal
  status: "scheduled" | "cancelled" | "active" | "landed" | null; // Current status
  delayMinutes: number | null; // Delay in minutes
};
```

### API Types (src/types/api/airlabs.ts)

Zod schemas for runtime validation:

- `AirLabsScheduleSchema` - Individual flight schedule
- `AirLabsSchedulesResponseSchema` - Full API response

---

## 7. Configuration

### Environment Variables

```bash
# Required
AIRLABS_API_KEY=your_api_key_here

# Optional (defaults shown)
DEFAULT_AIRPORT=SFO
```

### Runtime Config (src/constants/config.ts)

```typescript
config = {
  api: {
    airlabs: {
      baseUrl: "https://airlabs.co/api/v9",
      key: process.env.AIRLABS_API_KEY,
      timeout: 10000, // 10 seconds
    },
  },
  airport: {
    default: "SFO",
  },
  display: {
    flightsPerPage: 10,
  },
};
```

### TanStack Query Config

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Never auto-refetch
      gcTime: 1000 * 60 * 10, // Cache 10 minutes
      retry: 2, // Retry failed requests
      refetchOnWindowFocus: false, // No auto-refetch
      refetchOnReconnect: false, // No auto-refetch
    },
  },
});
```

---

## 8. Development Setup

### Installation

```bash
# Clone repository
git clone <repo-url>
cd ctrl-tower

# Install dependencies
bun install

# Create environment file
cp .env.example .env
# Edit .env and add your AIRLABS_API_KEY
```

### Running the App

```bash
# Development mode
bun run dev

# Build
bun run build

# Type check
bun run type-check
```

### Keyboard Shortcuts

**Title Screen:**

- Any key: Continue to main app

**Main App:**

- `Tab`: Cycle through tabs
- `1-4`: Jump to specific tab
- `Q`: Quit application

**Departures Board (Tab 1):**

- `R`: Refresh flight data
- `←` or `[`: Previous page
- `→` or `]`: Next page

---

## 9. Future Enhancements

These features are **not** part of the MVP but are planned for future releases:

### Phase 2: Arrivals

- Arrivals board (nearly identical to departures)
- Same pagination and refresh mechanics
- Use `/schedules?arr_iata=SFO` endpoint

### Phase 3: Enhanced Display

- Airport name resolution (IATA → full name)
- Split-flap mechanical board animations
- CRT screen effects (scan lines, glow)
- Color themes (amber, green, white)

### Phase 4: Live Map

- OpenSky Network API integration
- Real-time aircraft positions
- ASCII art world map visualization
- Regional view (300km radius)
- Aircraft tracking and selection

### Phase 5: Advanced Features

- Multiple airport support
- Flight detail view (expanded info)
- Search/filter flights
- Auto-refresh option (toggle)
- Historical data caching
- Notifications for specific flights

### Technical Debt to Address

- Replace IATA codes with full airport names
- Better error recovery strategies
- Unit and integration tests
- Performance profiling
- Accessibility improvements

---

## Notes

- Keep it simple! MVP first, then iterate
- Manual refresh conserves API calls
- Focus on solid foundation before adding features
- Use OpenTUI primitives - no custom renderers needed
- Type safety at API boundaries is critical
- Clean separation: API types → Domain types

---

**End of Specification**

For questions or suggestions, open an issue or PR.
