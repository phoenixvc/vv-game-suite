# VeritasVault Game Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-91.7%25-blue)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Built%20With-Turborepo-blueviolet)](https://turbo.build/)

## Overview

VeritasVault Game Suite is a collection of blockchain-integrated games developed by VeritasVault.ai. This monorepo contains the codebase for our gaming platform (VVX) and our first release title, "Crisis Unleashed".

## Features

- **Blockchain Integration**: Seamless integration with VeritasVault tokens
- **Web-Based Gaming**: Engaging experiences built with TypeScript and Phaser
- **DeFi Elements**: Financial mechanics incorporated into gameplay
- **Cross-Platform**: Play on desktop and mobile devices
- **Modular Architecture**: Built using a scalable monorepo structure

## Games

### Crisis Unleashed

Our flagship title combining strategic gameplay with blockchain rewards. Players can earn and utilize VeritasVault tokens within the game economy.

![Crisis Unleashed Screenshot](assets/images/crisis-unleashed-screenshot.png)

**Key Features:**
- Dynamic gameplay with increasing difficulty
- Token rewards for achievements and milestones
- Leaderboard with token-based incentives
- In-game marketplace for digital assets

## Technology Stack

- **Frontend**: TypeScript, React
- **Game Engine**: Phaser, WebGL
- **Blockchain**: VeritasVault token integration
- **Build System**: Turborepo
- **Styling**: CSS with custom theming

## Repository Structure

```
vv-game-suite/
├── .devcontainer/       # Development container configuration
├── .github/             # GitHub workflows and templates
├── .vscode/             # VS Code configuration
├── apps/                # Frontend applications
│   ├── crisis-unleashed/  # Crisis Unleashed game
│   └── platform/          # VVX gaming platform
├── packages/            # Shared libraries and utilities
│   ├── blockchain/        # Blockchain integration
│   ├── ui-components/     # Reusable UI components
│   └── game-engine/       # Shared game mechanics
├── scripts/             # Build and deployment scripts
├── styles/              # Shared styling resources
├── turbo.json           # Turborepo configuration
└── package.json         # Root package configuration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VeritasVault-ai/vv-game-suite.git
   cd vv-game-suite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

This is a Turborepo-based monorepo. To develop all apps and packages:

```bash
npm run dev
```

### Building Specific Packages

To build a specific package:

```bash
npm run build -- --filter=crisis-unleashed
```

### Build All

To build all apps and packages:

```bash
npm run build
```

## Testing

Run tests across all packages:

```bash
npm run test
```

## Deployment

Deployment scripts are available in the `scripts` directory:

```bash
npm run deploy
```

## Blockchain Integration

The VeritasVault token integration allows players to:

- Earn tokens through gameplay achievements
- Spend tokens on in-game assets and upgrades
- Trade assets on the marketplace
- Participate in token-based governance decisions

## Contributing

We welcome contributions to the VeritasVault Game Suite! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in our community.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [veritasvault.ai](https://veritasvault.ai)
- GitHub: [@VeritasVault-ai](https://github.com/VeritasVault-ai)
- Discord: [Join our community](https://discord.gg/veritasvault)
- Twitter: [@VeritasVault](https://twitter.com/VeritasVault)

## Acknowledgments

- The Phaser game development community
- Contributors to the open-source libraries we use
- Our beta testers and early community members
