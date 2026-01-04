# Ctrl-Tower Specification

**Version:** 0.1.0  
**Last Updated:** January 3, 2026  
**Status:** Active Development

> **Living Document:** This specification serves as the single source of truth for the ctrl-tower project. All architectural decisions, technical requirements, and project goals are documented here for easy reference across development sessions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [API Integration Strategy](#3-api-integration-strategy)
4. [Architecture](#4-architecture)
5. [Design System](#5-design-system)
6. [Features & MVP Scope](#6-features--mvp-scope)
7. [Navigation & UX](#7-navigation--ux)
8. [Data Models](#8-data-models)
9. [Configuration](#9-configuration)
10. [Development Roadmap](#10-development-roadmap)
11. [Performance Requirements](#11-performance-requirements)
12. [Testing Strategy](#12-testing-strategy)
13. [Known Limitations](#13-known-limitations)

---

## 1. Project Overview

### Vision
**ctrl-tower** is a retro-style terminal user interface (TUI) application that serves as a comprehensive flight information hub. Inspired by classic split-flap airport departure boards and amber CRT monitors, it provides real-time flight tracking, arrivals/departures information, and live aircraft position visualization—all in a stunning terminal interface.

### Core Objectives
- **Retro Aesthetic:** Amber/orange CRT display with split-flap mechanical board styling
- **Real-Time Data:** Live flight tracking and airport schedule information
- **Visual Excellence:** Complex ASCII art visualizations and smooth 60fps animations
- **Developer Experience:** Type-safe, modular, loosely-coupled architecture
- **Performance:** Optimized for smooth rendering and minimal API usage

### Default Configuration
- **Default Airport:** SFO (San Francisco International Airport)
- **Regional Map Radius:** 300km from selected airport
- **Target Frame Rate:** 60fps minimum

---

## 2. Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Bun** | 1.1.26+ | Runtime & package manager |
| **TypeScript** | 5.0+ | Type-safe development |
| **@opentui/react** | 0.1.68+ | React reconciler for TUI |
| **@opentui/core** | 0.1.68+ | Core TUI primitives |
| **React** | 19.2.3+ | UI framework |
| **Zod** | 4.3.4+ | Runtime type validation |
| **date-fns** | 4.1.0+ | Date/time formatting |

### Prerequisites
- Zig compiler (required for building @opentui packages)
- Bun installed globally
- API keys:
  - AirLabs API key (free tier: 10,000 requests/month)
  - OpenSky Network (optional authentication for higher rate limits)

### Type Safety Philosophy
- **Strict TypeScript:** All compiler strictness flags enabled
- **Runtime Validation:** Zod schemas for API responses
- **No `any` types:** Explicit types throughout
- **Exhaustive Checking:** Union type exhaustiveness in switch statements

---

## 3. API Integration Strategy

### Overview
ctrl-tower uses a **dual-API composition** strategy to maximize free tier benefits and data coverage:

1. **AirLabs API:** Airport schedules, flight status, static data (airlines, airports)
2. **OpenSky Network API:** Real-time aircraft positions and flight physics

### 3.1 AirLabs API

**Purpose:** Primary source for airport arrivals/departures and flight schedules

**Free Tier Limits:**
- 10,000 requests/month
- No authentication beyond API key
- JSON/XML/CSV response formats

**Key Endpoints:**

#### `/schedules` - Live Airport Schedules
```http
GET https://airlabs.co/api/v9/schedules?dep_iata=SFO&api_key=XXX
```

**Query Parameters:**
- `dep_iata` - Departure airport IATA code (for departures board)
- `arr_iata` - Arrival airport IATA code (for arrivals board)
- `airline_iata` - Filter by airline (optional)
- `limit` - Max results (default: 100, max: 1000)
- `offset` - Pagination offset

**Response Fields:**
```typescript
{
  airline_iata: string;           // "AA"
  airline_icao: string;           // "AAL"
  flight_iata: string;            // "AA2421"
  flight_number: string;          // "2421"
  dep_iata: string;               // "SFO"
  dep_terminal?: string;          // "2"
  dep_gate?: string;              // "D11"
  dep_time: string;               // "2021-07-14 19:53"
  dep_estimated?: string;         // "2021-07-14 22:10"
  dep_actual?: string;            // "2021-07-14 22:10"
  arr_iata: string;               // "JFK"
  arr_terminal?: string;          // "4"
  arr_gate?: string;              // "B24"
  arr_time: string;               // "2021-07-14 22:52"
  status: "scheduled" | "active" | "landed" | "cancelled";
  dep_delayed?: number;           // minutes
  arr_delayed?: number;           // minutes
}
```

#### `/flights` - Real-Time Flight Tracking (Optional)
Can be used to enrich OpenSky data with flight numbers and destinations.

```http
GET https://airlabs.co/api/v9/flights?bbox=-125,35,-120,40&api_key=XXX
```

**Query Parameters:**
- `bbox` - Bounding box (SW-Lat, SW-Lng, NE-Lat, NE-Lng)
- `dep_iata` / `arr_iata` - Filter by airport
- `flight_iata` - Specific flight lookup

#### `/airports`, `/airlines`, `/cities` - Static Databases
For airport info, airline details, and city lookups. Fetch once and cache.

**Rate Limiting Strategy:**
- **Schedules:** 5-minute refresh interval (576 requests/day = ~17,280/month)
- **Caching:** Aggressive 300-second TTL to stay under 10k/month limit
- **Fallback:** Increase cache TTL to 10 minutes if approaching limit
- **Static Data:** Fetch once on startup, cache indefinitely

### 3.2 OpenSky Network API

**Purpose:** Primary source for live aircraft positions and flight physics

**Free Tier:**
- Unlimited requests (anonymous)
- Higher rate limits with free registration
- Updates every 10 seconds

**Key Endpoint:**

#### `/states/all` - All Aircraft State Vectors
```http
GET https://opensky-network.org/api/states/all
```

**Optional Query Parameters:**
- `time` - Unix timestamp (defaults to now)
- `icao24` - Specific aircraft hex address
- `lamin`, `lomin`, `lamax`, `lomax` - Bounding box

**Response Format:**
```javascript
{
  "time": 1626153069,
  "states": [
    [
      "a12345",        // icao24
      "AAL2421 ",      // callsign
      "United States", // origin_country
      1626153069,      // time_position
      1626153069,      // last_contact
      -122.375,        // longitude
      37.619,          // latitude
      10668.0,         // baro_altitude (meters)
      false,           // on_ground
      231.7,           // velocity (m/s)
      45.0,            // true_track (degrees)
      -3.25,           // vertical_rate (m/s)
      null,            // sensors (IDs)
      10500.0,         // geo_altitude (meters)
      "1234",          // squawk
      false,           // spi
      0                // position_source
    ],
    // ... more aircraft
  ]
}
```

**Data Mapping:**
- Position: `[5]` = longitude, `[6]` = latitude
- Altitude: `[7]` = barometric altitude (meters)
- Speed: `[9]` = velocity (m/s → multiply by 3.6 for km/h)
- Heading: `[10]` = true track (degrees)
- Status: `[8]` = on_ground (boolean)

**Update Strategy:**
- Poll every 10-15 seconds for live map
- Filter by bounding box for regional mode
- No authentication required (optional for higher limits)

### 3.3 Data Correlation Strategy

**Enriching OpenSky with AirLabs:**
- Match aircraft by `callsign` or `icao24` between APIs
- Display flight number, origin/destination from AirLabs on map
- Cache correlations to reduce API calls
- Graceful degradation: show position-only if no match

---

## 4. Architecture

### 4.1 Project Structure

```
ctrl-tower/
├── SPEC.md                          # This document
├── README.md                        # Setup & usage guide
├── package.json
├── tsconfig.json
├── bun.lockb
├── .env.example
├── .env                             # Gitignored
├── .gitignore
│
├── src/
│   ├── index.tsx                    # Entry point, renders App
│   ├── app.tsx                      # Root app component with tab state
│   │
│   ├── components/
│   │   ├── splash/
│   │   │   ├── SplashScreen.tsx     # Main splash component
│   │   │   ├── BootSequence.tsx     # Terminal boot animation
│   │   │   └── LogoReveal.tsx       # Animated logo
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Top bar (time, airport)
│   │   │   ├── Footer.tsx           # Status bar (shortcuts, API quota)
│   │   │   └── TabBar.tsx           # Tab navigation
│   │   │
│   │   ├── arrivals/
│   │   │   ├── ArrivalsBoard.tsx    # Main arrivals component
│   │   │   └── ArrivalRow.tsx       # Individual flight row
│   │   │
│   │   ├── departures/
│   │   │   ├── DeparturesBoard.tsx  # Main departures component
│   │   │   └── DepartureRow.tsx     # Individual flight row
│   │   │
│   │   ├── live-map/
│   │   │   ├── LiveMap.tsx          # Main map container
│   │   │   ├── GlobalMap.tsx        # Global view mode
│   │   │   ├── RegionalMap.tsx      # Regional 300km view
│   │   │   ├── AircraftMarker.tsx   # Aircraft symbol renderer
│   │   │   └── MapControls.tsx      # Mode toggle, zoom
│   │   │
│   │   ├── common/
│   │   │   ├── RetroText.tsx        # Styled text component
│   │   │   ├── BorderBox.tsx        # Box-drawing borders
│   │   │   ├── LoadingSpinner.tsx   # Loading animation
│   │   │   └── ErrorDisplay.tsx     # Error UI
│   │   │
│   │   └── effects/
│   │       ├── CRTEffect.tsx        # Scan lines & glow
│   │       ├── SplitFlapFlip.tsx    # Mechanical flip animation
│   │       └── GlitchEffect.tsx     # Screen glitch
│   │
│   ├── hooks/
│   │   ├── useSchedules.ts          # Fetches AirLabs schedules
│   │   ├── useAircraftPositions.ts  # Fetches OpenSky data
│   │   ├── useKeyboard.ts           # Keyboard navigation
│   │   ├── useInterval.ts           # Polling helper
│   │   └── useTabNavigation.ts      # Tab state management
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── airlabs.ts           # AirLabs API client
│   │   │   ├── opensky.ts           # OpenSky API client
│   │   │   └── httpClient.ts        # Shared fetch wrapper
│   │   │
│   │   ├── cache/
│   │   │   └── dataCache.ts         # In-memory cache with TTL
│   │   │
│   │   └── mappers/
│   │       ├── scheduleMapper.ts    # Map AirLabs → domain types
│   │       └── aircraftMapper.ts    # Map OpenSky → domain types
│   │
│   ├── types/
│   │   ├── flight.ts                # Flight domain types
│   │   ├── aircraft.ts              # Aircraft domain types
│   │   ├── airport.ts               # Airport domain types
│   │   └── api/
│   │       ├── airlabs.ts           # AirLabs API response types
│   │       └── opensky.ts           # OpenSky API response types
│   │
│   ├── utils/
│   │   ├── formatting.ts            # Date/time/distance formatters
│   │   ├── ascii-art.ts             # ASCII art generators
│   │   ├── animations.ts            # Animation helpers
│   │   └── mapProjection.ts         # Lat/lng → screen coordinates
│   │
│   ├── styles/
│   │   └── theme.ts                 # Color palette & styling
│   │
│   └── constants/
│       ├── airports.ts              # Common IATA codes
│       ├── keyBindings.ts           # Keyboard shortcuts
│       └── config.ts                # App configuration
│
├── assets/
│   └── ascii/
│       ├── logo.txt                 # Splash screen logo
│       ├── world-map-simple.txt     # ASCII world map template
│       └── aircraft-icons.txt       # Aircraft symbols
│
└── tests/
    ├── services/
    └── utils/
```

### 4.2 Component Hierarchy

```
App
├── SplashScreen (on startup)
└── MainApp
    ├── Header
    ├── TabBar
    ├── TabContent
    │   ├── ArrivalsBoard (Tab 1)
    │   │   └── ArrivalRow[] (with SplitFlapFlip)
    │   ├── DeparturesBoard (Tab 2)
    │   │   └── DepartureRow[] (with SplitFlapFlip)
    │   ├── LiveMap (Tab 3)
    │   │   ├── GlobalMap | RegionalMap
    │   │   └── AircraftMarker[]
    │   └── HelpScreen (Tab 4)
    └── Footer
```

### 4.3 State Management

**Approach:** React Context + Hooks (no external state library)

**Global State:**
- Current tab index
- Selected airport code
- Map view mode (global/regional)
- Theme/CRT effects settings

**Local State:**
- Arrivals/departures data (from useSchedules hook)
- Aircraft positions (from useAircraftPositions hook)
- Selected flight/aircraft
- Loading/error states

### 4.4 Module Boundaries

**Principles:**
- **Loose Coupling:** Components depend on abstractions (hooks), not concrete implementations
- **Single Responsibility:** Each module has one clear purpose
- **Dependency Injection:** API clients are injectable for testing
- **Type Safety:** All boundaries have explicit TypeScript interfaces

**Example:**
```typescript
// ❌ BAD: Tight coupling
import { fetchSchedules } from './services/api/airlabs';

function ArrivalsBoard() {
  const data = await fetchSchedules('SFO');
  // ...
}

// ✅ GOOD: Loose coupling via hook abstraction
import { useSchedules } from './hooks/useSchedules';

function ArrivalsBoard() {
  const { arrivals, loading, error } = useSchedules('SFO', 'arrivals');
  // ...
}
```

---

## 5. Design System

### 5.1 Color Palette (Amber/Orange CRT)

```typescript
export const theme = {
  // Primary amber/orange tones
  primary: '#FF8C00',         // Dark Orange
  secondary: '#FFA500',       // Orange
  accent: '#FFD700',          // Gold (highlights)
  
  // Background (dark for CRT phosphor glow)
  background: '#0A0A0A',      // Almost black
  backgroundAlt: '#1A1A1A',   // Slightly lighter
  
  // Text colors
  text: '#FFA500',            // Orange text
  textDim: '#CC7000',         // Dimmed orange
  textBright: '#FFBB33',      // Bright orange
  
  // Status colors (amber-toned)
  success: '#FFD700',         // Gold
  warning: '#FF6600',         // Dark orange
  error: '#FF4500',           // Orange red
  info: '#FFA500',            // Standard orange
  
  // Split-flap board
  flapBackground: '#2A2A2A',  // Dark gray
  flapText: '#FFA500',        // Orange
  flapBorder: '#4A4A2A',      // Olive-gray
  
  // CRT effects
  scanLine: '#000000',        // Black with opacity
  glow: '#FF8C00',            // Orange glow
};
```

### 5.2 Typography

- **Font Family:** Monospace (system default)
- **Character Set:** ASCII + Box-drawing characters
- **Box Drawing:** `┌─┐│└┘├┤┬┴┼╔═╗║╚╝╠╣╦╩╬`
- **Aircraft Symbols:** `✈ ▲ ▼ ◄ ► ◆ ●`

### 5.3 Layout Constants

```typescript
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
  
  // Tab bar
  tabBarHeight: 3,
  tabWidth: 15,
  
  // Header/Footer
  headerHeight: 3,
  footerHeight: 2,
};
```

### 5.4 Animation Principles

**Target:** 60fps minimum

**Techniques:**
- **Interpolation:** Smooth position transitions for aircraft
- **Easing:** Ease-in-out for split-flap flips
- **Frame Budgets:** Max 16.67ms per frame (60fps)
- **Requestable Animation Frames:** Use RAF-equivalent for TUI

**Split-Flap Animation:**
```
Frame 1: Original character
Frame 2: Half-flip (top character visible)
Frame 3: Mid-flip (blank/transition)
Frame 4: Half-flip (new character visible)
Frame 5: New character
```

**CRT Effects:**
- Scan lines: Horizontal lines with 50% opacity, moving top→bottom
- Phosphor glow: Character bloom effect (duplicate char with offset)
- Flicker: Occasional brightness variation (5% chance per frame)

---

## 6. Features & MVP Scope

### Phase 1: Core Infrastructure + Splash Screen ✅
**Duration:** Week 1

**Deliverables:**
- [x] Project scaffold (Bun + TypeScript + OpenTUI)
- [x] SPEC.md creation
- [ ] Killer splash screen with:
  - Retro airport logo (ASCII art)
  - Boot sequence animation
  - CRT scan line effects
  - Character-by-character reveal
  - Phosphor glow simulation

**Visual Reference:**
```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        ░█████╗░████████╗██████╗░██╗░░░░░              ║
║        ██╔══██╗╚══██╔══╝██╔══██╗██║░░░░░              ║
║        ██║░░╚═╝░░░██║░░░██████╔╝██║░░░░░              ║
║        ██║░░██╗░░░██║░░░██╔══██╗██║░░░░░              ║
║        ╚█████╔╝░░░██║░░░██║░░██║███████╗              ║
║        ░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝              ║
║                                                          ║
║       ████████╗░█████╗░░██╗░░░░░░░██╗███████╗██████╗   ║
║       ╚══██╔══╝██╔══██╗░██║░░██╗░░██║██╔════╝██╔══██╗  ║
║       ░░░██║░░░██║░░██║░╚██╗████╗██╔╝█████╗░░██████╔╝  ║
║       ░░░██║░░░██║░░██║░░████╔═████║░██╔══╝░░██╔══██╗  ║
║       ░░░██║░░░╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗██║░░██║  ║
║       ░░░╚═╝░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚═╝░░╚═╝  ║
║                                                          ║
║            FLIGHT INFORMATION MANAGEMENT SYSTEM          ║
║                    Version 0.1.0                         ║
║                                                          ║
║                  [ INITIALIZING... ]                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Phase 2: Arrivals & Departures Boards
**Duration:** Week 2-3

**Features:**
- AirLabs `/schedules` API integration
- Split-flap mechanical board aesthetic
- Real-time updates (5-minute intervals)
- Flight status display:
  - Scheduled (standard orange)
  - Boarding (bright orange)
  - Departed (dimmed orange)
  - Delayed (pulsing orange)
  - Cancelled (strikethrough)

**Board Layout:**
```
╔════════════════════════════════════════════════════════════════════╗
║  ARRIVALS - SFO (San Francisco International)      19:45:32 UTC   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Time    Flight   From          Airline      Gate   Status        ║
║  ─────────────────────────────────────────────────────────────────║
║  19:30   AA2421   JFK (New York)  American    B24    ◆ LANDED     ║
║  19:45   UA1234   ORD (Chicago)   United      C15    → EN ROUTE   ║
║  20:00   DL5678   ATL (Atlanta)   Delta       A12    ⏱ DELAYED    ║
║  20:15   SW9012   LAX (L.A.)      Southwest   D08    ✓ SCHEDULED  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

### Phase 3: Live Flight Map
**Duration:** Week 3-4

**Features:**
- ASCII world map rendering (simple coastlines)
- OpenSky API integration
- Global mode: Show all worldwide flights
- Regional mode: 300km radius around SFO
- Toggle with `M` key
- Aircraft markers with directional arrows
- Real-time position updates (10-second intervals)
- Smooth interpolated movement
- Selected aircraft detail panel

**Map Layout (Regional Mode):**
```
╔════════════════════════════════════════════════════════════════════╗
║  LIVE MAP - Regional (300km radius from SFO)                       ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║                 ░░░░                                               ║
║               ░░░░░░░░                                             ║
║              ░░░░SFO░░    ▲ UAL1234                                ║
║            ░░░░░░░░░░░░                                            ║
║           ░░░░░░░░░░░░░░     ▼ AAL5678                             ║
║          ░░░░░░░░░░░░░░░░                                          ║
║         ░░░░░░░░░░░░░░░░░                                          ║
║        ░░░░░░░░░░░░░░░░░░░   ► SWA9012                             ║
║                                                                    ║
║  ┌─ Selected Aircraft ────────────────────────┐                   ║
║  │ Callsign: UAL1234                          │                   ║
║  │ Altitude: 35,000 ft                        │                   ║
║  │ Speed: 450 kts                             │                   ║
║  │ Heading: 045° (NE)                         │                   ║
║  └────────────────────────────────────────────┘                   ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

### Phase 4: Polish & Effects
**Duration:** Week 5

**Features:**
- CRT scan line animation
- Phosphor glow effect
- Split-flap flip animation refinement
- Error handling with retro error screens
- Loading state animations
- Help overlay (`?` key)
- Performance optimization

---

## 7. Navigation & UX

### 7.1 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Switch tabs forward |
| `Shift+Tab` | Switch tabs backward |
| `1-4` | Jump to tab (1=Arrivals, 2=Departures, 3=Map, 4=Help) |
| `↑/↓` | Navigate within lists |
| `Enter` | Select flight/aircraft |
| `Esc` | Go back / close detail |
| `M` | Toggle map mode (Global ↔ Regional) |
| `R` | Refresh data manually |
| `?` | Show help overlay |
| `Q` | Quit application |

### 7.2 Tab Structure

```
┌──────────┬────────────┬──────────┬──────┐
│ ARRIVALS │ DEPARTURES │ LIVE MAP │ HELP │
└──────────┴────────────┴──────────┴──────┘
```

### 7.3 User Flows

**Startup:**
1. Splash screen (3 seconds)
2. Load to Arrivals tab
3. Fetch initial data for SFO

**Viewing Flights:**
1. Navigate to Arrivals/Departures
2. Use arrow keys to highlight flight
3. Press Enter for details
4. Press Esc to return

**Exploring Map:**
1. Navigate to Live Map tab
2. Press `M` to toggle Global/Regional
3. Click aircraft or use arrows to select
4. View details in side panel

---

## 8. Data Models

### 8.1 Domain Types

```typescript
// types/flight.ts
export interface Flight {
  id: string;
  flightNumber: string;
  flightIATA: string;
  flightICAO: string;
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  departure: {
    airport: string;
    iata: string;
    terminal?: string;
    gate?: string;
    scheduledTime: Date;
    estimatedTime?: Date;
    actualTime?: Date;
    delayed?: number; // minutes
  };
  arrival: {
    airport: string;
    iata: string;
    terminal?: string;
    gate?: string;
    scheduledTime: Date;
    estimatedTime?: Date;
    actualTime?: Date;
    delayed?: number; // minutes
  };
  status: FlightStatus;
}

export type FlightStatus = 
  | 'scheduled' 
  | 'boarding' 
  | 'departed' 
  | 'active' 
  | 'landed' 
  | 'cancelled' 
  | 'diverted';

// types/aircraft.ts
export interface AircraftPosition {
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number; // meters
  velocity: number; // m/s
  heading: number; // degrees 0-359
  verticalRate: number; // m/s
  onGround: boolean;
  lastUpdate: Date;
  
  // Optional enrichment from AirLabs
  flightNumber?: string;
  origin?: string;
  destination?: string;
}

// types/airport.ts
export interface Airport {
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
```

### 8.2 API Response Types (Zod Schemas)

```typescript
// types/api/airlabs.ts
import { z } from 'zod';

export const AirLabsScheduleSchema = z.object({
  airline_iata: z.string(),
  airline_icao: z.string(),
  flight_iata: z.string(),
  flight_icao: z.string(),
  flight_number: z.string(),
  dep_iata: z.string(),
  dep_icao: z.string(),
  dep_terminal: z.string().optional(),
  dep_gate: z.string().optional(),
  dep_time: z.string(),
  dep_estimated: z.string().optional(),
  dep_actual: z.string().optional(),
  arr_iata: z.string(),
  arr_icao: z.string(),
  arr_terminal: z.string().optional(),
  arr_gate: z.string().optional(),
  arr_time: z.string(),
  arr_estimated: z.string().optional(),
  arr_actual: z.string().optional(),
  status: z.enum(['scheduled', 'active', 'landed', 'cancelled']),
  dep_delayed: z.number().optional(),
  arr_delayed: z.number().optional(),
});

export type AirLabsSchedule = z.infer<typeof AirLabsScheduleSchema>;

// types/api/opensky.ts
export const OpenSkyStateSchema = z.tuple([
  z.string(),           // icao24
  z.string().nullable(),// callsign
  z.string(),           // origin_country
  z.number().nullable(),// time_position
  z.number(),           // last_contact
  z.number().nullable(),// longitude
  z.number().nullable(),// latitude
  z.number().nullable(),// baro_altitude
  z.boolean(),          // on_ground
  z.number().nullable(),// velocity
  z.number().nullable(),// true_track
  z.number().nullable(),// vertical_rate
  z.array(z.number()).nullable(), // sensors
  z.number().nullable(),// geo_altitude
  z.string().nullable(),// squawk
  z.boolean(),          // spi
  z.number(),           // position_source
]);

export type OpenSkyState = z.infer<typeof OpenSkyStateSchema>;
```

---

## 9. Configuration

### 9.1 Environment Variables

**`.env.example`:**
```bash
# AirLabs API
AIRLABS_API_KEY=your_api_key_here

# OpenSky Network (optional - higher rate limits with auth)
OPENSKY_USERNAME=
OPENSKY_PASSWORD=

# Default Airport
DEFAULT_AIRPORT=SFO

# Refresh Intervals (seconds)
SCHEDULES_REFRESH_INTERVAL=300       # 5 minutes
AIRCRAFT_REFRESH_INTERVAL=10         # 10 seconds

# Map Settings
MAP_VIEW_MODE=global                 # global or regional
REGIONAL_MAP_RADIUS=300              # kilometers

# Performance
TARGET_FPS=60
ENABLE_CRT_EFFECTS=true
ENABLE_ANIMATIONS=true

# Cache
CACHE_TTL_SCHEDULES=300              # 5 minutes
CACHE_TTL_STATIC=86400               # 24 hours
```

### 9.2 Runtime Configuration

```typescript
// src/constants/config.ts
export const config = {
  api: {
    airlabs: {
      baseUrl: 'https://airlabs.co/api/v9',
      key: process.env.AIRLABS_API_KEY || '',
      timeout: 10000, // 10 seconds
    },
    opensky: {
      baseUrl: 'https://opensky-network.org/api',
      username: process.env.OPENSKY_USERNAME,
      password: process.env.OPENSKY_PASSWORD,
      timeout: 10000,
    },
  },
  
  airport: {
    default: process.env.DEFAULT_AIRPORT || 'SFO',
  },
  
  refresh: {
    schedules: parseInt(process.env.SCHEDULES_REFRESH_INTERVAL || '300', 10),
    aircraft: parseInt(process.env.AIRCRAFT_REFRESH_INTERVAL || '10', 10),
  },
  
  map: {
    defaultMode: process.env.MAP_VIEW_MODE === 'regional' ? 'regional' : 'global',
    regionalRadius: parseInt(process.env.REGIONAL_MAP_RADIUS || '300', 10),
  },
  
  performance: {
    targetFPS: parseInt(process.env.TARGET_FPS || '60', 10),
    enableCRTEffects: process.env.ENABLE_CRT_EFFECTS !== 'false',
    enableAnimations: process.env.ENABLE_ANIMATIONS !== 'false',
  },
  
  cache: {
    ttlSchedules: parseInt(process.env.CACHE_TTL_SCHEDULES || '300', 10),
    ttlStatic: parseInt(process.env.CACHE_TTL_STATIC || '86400', 10),
  },
} as const;
```

---

## 10. Development Roadmap

### Week 1: Foundation (Jan 3-10)
- [x] Project scaffold
- [x] SPEC.md creation
- [ ] Splash screen with animations
- [ ] Basic app shell with tab navigation
- [ ] Theme system implementation

### Week 2: Data Integration (Jan 10-17)
- [ ] AirLabs API client
- [ ] OpenSky API client
- [ ] Data caching layer
- [ ] Type mappers (API → domain)
- [ ] Hook abstractions (useSchedules, useAircraftPositions)

### Week 3: Arrivals/Departures (Jan 17-24)
- [ ] ArrivalsBoard component
- [ ] DeparturesBoard component
- [ ] Flight row components with split-flap animation
- [ ] Status indicators
- [ ] Real-time refresh logic

### Week 4: Live Map (Jan 24-31)
- [ ] ASCII world map generation
- [ ] Mercator projection utilities
- [ ] GlobalMap component
- [ ] RegionalMap component
- [ ] Aircraft marker rendering
- [ ] Position interpolation
- [ ] Mode toggle implementation

### Week 5: Polish (Jan 31-Feb 7)
- [ ] CRT effects (scan lines, glow)
- [ ] Performance optimization
- [ ] Error handling
- [ ] Help screen
- [ ] Final testing & bug fixes

---

## 11. Performance Requirements

### 11.1 Target Metrics

- **Frame Rate:** 60fps minimum (16.67ms budget per frame)
- **Startup Time:** < 3 seconds (including splash)
- **API Response Time:** < 2 seconds for data fetch
- **Memory Usage:** < 100MB
- **CPU Usage:** < 20% (idle), < 50% (active animations)

### 11.2 Optimization Strategies

**Rendering:**
- Virtual scrolling for long flight lists (>100 items)
- Debounce keyboard input (50ms)
- Throttle map updates (10fps for background, 60fps for foreground)

**API:**
- Aggressive caching (5-minute TTL)
- Request deduplication
- Batch static data fetches on startup

**Animations:**
- Use requestAnimationFrame equivalent
- Skip frames if behind schedule
- Disable effects on low-end hardware (auto-detect)

---

## 12. Testing Strategy

### 12.1 Unit Tests
- API clients (mocked responses)
- Data mappers (API → domain)
- Utility functions (formatting, projections)
- Hooks (with React Testing Library)

### 12.2 Integration Tests
- API → Cache → Component flow
- Keyboard navigation
- Tab switching
- Data refresh cycles

### 12.3 Manual Testing
- Visual regression (screenshots)
- Performance profiling (bun --inspect)
- API rate limit testing
- Error scenario testing

---

## 13. Known Limitations

### MVP Scope
- No historical flight data (only current/future)
- No push notifications or alerts
- No multi-airport comparison
- No weather overlays
- No flight search (manual tab navigation only)

### API Constraints
- **AirLabs Free Tier:** 10,000 requests/month
  - Limits refresh frequency to 5-10 minutes
  - No HTTPS on free tier (HTTP only)
- **OpenSky:** No historical data without auth
  - Rate limits on anonymous access

### Technical
- **Terminal Size:** Minimum 80x24 required
- **Color Support:** Requires 256-color terminal
- **Platform:** Optimized for macOS/Linux (Windows may have rendering issues)

---

## Future Enhancements (Post-MVP)

*These are intentionally minimal per user request to focus on MVP:*

- Flight search functionality
- Multi-airport watchlist
- Weather data integration
- Historical flight tracking
- Custom alert rules
- Export/screenshot capabilities

---

**End of Specification**

*This document is actively maintained and updated as the project evolves.*
