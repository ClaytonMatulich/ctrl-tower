# Ctrl-Tower

> **A retro-style flight information TUI** - Real-time flight tracking in your terminal with amber CRT aesthetics

Ctrl-Tower is a terminal user interface (TUI) application that brings the classic split-flap airport departure board experience to your command line. Track live flights, monitor arrivals and departures, and visualize aircraft positions on an ASCII map—all with a beautiful retro amber/orange CRT aesthetic.

```
╔══════════════════════════════════════════════════════════╗
║        ░█████╗░████████╗██████╗░██╗░░░░░                 ║
║        ██╔══██╗╚══██╔══╝██╔══██╗██║░░░░░                 ║
║        ██║░░╚═╝░░░██║░░░██████╔╝██║░░░░░                 ║
║        ██║░░██╗░░░██║░░░██╔══██╗██║░░░░░                 ║
║        ╚█████╔╝░░░██║░░░██║░░██║███████╗                 ║
║        ░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝                 ║
║       ████████╗░█████╗░░██╗░░░░░░░██╗███████╗██████╗     ║
║       ╚══██╔══╝██╔══██╗░██║░░██╗░░██║██╔════╝██╔══██╗    ║
║       ░░░██║░░░██║░░██║░╚██╗████╗██╔╝█████╗░░██████╔╝    ║
║       ░░░██║░░░██║░░██║░░████╔═████║░██╔══╝░░██╔══██╗    ║
║       ░░░██║░░░╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗██║░░██║    ║
║       ░░░╚═╝░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚═╝░░╚═╝    ║
╚══════════════════════════════════════════════════════════╝
```

## Features

- **Real-Time Flight Tracking:** Live aircraft positions from OpenSky Network
- **Arrivals & Departures:** Airport schedules from AirLabs API
- **ASCII Map Visualization:** Global and regional (300km) view modes
- **Split-Flap Animations:** Mechanical board aesthetic with smooth transitions
- **CRT Effects:** Scan lines, phosphor glow, and authentic retro styling
- **60fps Performance:** Smooth animations and responsive UI
- **Type-Safe:** Built with TypeScript for reliability

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (v1.1.26 or higher) - [Installation guide](https://bun.sh)
- **Zig** - Required for building @opentui packages - [Installation guide](https://ziglang.org/learn/getting-started/)
- **256-color terminal** - For full color support

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ctrl-tower.git
cd ctrl-tower
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure API keys

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```bash
# Get your free API key at https://airlabs.co/signup
AIRLABS_API_KEY=your_api_key_here

# Optional: OpenSky Network credentials for higher rate limits
# Register at https://opensky-network.org/
OPENSKY_USERNAME=
OPENSKY_PASSWORD=
```

**Getting API Keys:**

- **AirLabs** (required): Free tier includes 1,000 requests/month

  - Sign up: https://airlabs.co/signup
  - Find your API key in the dashboard

- **OpenSky Network** (optional): Unlimited free access, registration increases rate limits
  - Sign up: https://opensky-network.org/

### 4. Run the application

```bash
bun run dev
```

Or simply:

```bash
bun start
```

## Keyboard Shortcuts

| Key         | Action                                                |
| ----------- | ----------------------------------------------------- |
| `Tab`       | Switch to next tab                                    |
| `Shift+Tab` | Switch to previous tab                                |
| `1-4`       | Jump to tab (1=Arrivals, 2=Departures, 3=Map, 4=Help) |
| `↑/↓`       | Navigate within lists                                 |
| `Enter`     | Select flight/aircraft                                |
| `Esc`       | Go back / close detail view                           |
| `M`         | Toggle map mode (Global ↔ Regional)                   |
| `R`         | Refresh data manually                                 |
| `?`         | Show help overlay                                     |
| `Q`         | Quit application                                      |

## Configuration

All configuration is managed through environment variables. See `.env.example` for available options:

```bash
# Default airport for arrivals/departures
DEFAULT_AIRPORT=SFO

# Data refresh intervals (seconds)
SCHEDULES_REFRESH_INTERVAL=300  # 5 minutes
AIRCRAFT_REFRESH_INTERVAL=10    # 10 seconds

# Map settings
MAP_VIEW_MODE=global            # global or regional
REGIONAL_MAP_RADIUS=300         # kilometers

# Performance
TARGET_FPS=60
ENABLE_CRT_EFFECTS=true
ENABLE_ANIMATIONS=true
```

## Project Structure

```
ctrl-tower/
├── src/
│   ├── components/         # React components
│   │   ├── splash/        # Splash screen
│   │   ├── arrivals/      # Arrivals board
│   │   ├── departures/    # Departures board
│   │   ├── live-map/      # ASCII map visualization
│   │   └── common/        # Shared components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API clients and data services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── styles/            # Theme and styling
│   └── constants/         # Configuration constants
├── assets/                # ASCII art and static assets
├── SPEC.md                # Complete project specification
└── README.md              # This file
```

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **UI Framework:** @opentui/react (React reconciler for TUIs)
- **APIs:**
  - AirLabs Data API (flight schedules)
  - OpenSky Network API (aircraft positions)
- **Validation:** Zod (runtime type checking)
- **Date/Time:** date-fns

## Development

### Type Checking

```bash
bun run type-check
```

### Project Documentation

See [SPEC.md](./SPEC.md) for the complete project specification, including:

- Detailed architecture
- API integration strategy
- Design system
- Development roadmap
- Performance requirements

## API Usage & Rate Limits

### AirLabs (Free Tier)

- **Limit:** 10,000 requests/month
- **Usage:** Fetching airport schedules every 5 minutes
- **Estimated:** ~8,640 requests/month (well under limit)

### OpenSky Network (Free)

- **Limit:** Unlimited with optional registration
- **Usage:** Real-time aircraft positions every 10 seconds
- **Cost:** Free

## Troubleshooting

### "Module not found" errors

Make sure you've installed all dependencies:

```bash
bun install
```

### OpenTUI build errors

Ensure Zig is installed and in your PATH:

```bash
zig version
```

### API errors

Check that your `.env` file is configured with valid API keys:

```bash
cat .env
```

### Terminal rendering issues

Ensure your terminal supports 256 colors:

```bash
echo $TERM
# Should output something like: xterm-256color
```

## Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Acknowledgments

- Built with [OpenTUI](https://opentui.com) by Anomaly
- Flight data provided by [AirLabs](https://airlabs.co) and [OpenSky Network](https://opensky-network.org)
- Inspired by classic split-flap departure boards and vintage CRT terminals

---

**Default Airport:** SFO (San Francisco International)  
**Made with Bun** 🥟
