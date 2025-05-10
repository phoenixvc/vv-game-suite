# VV Game Suite - Utils

This package contains shared utility functions that can be used across all games in the VV Game Suite.

## Features

- Error handling utilities
- Performance monitoring
- Web3/Wallet integration helpers
- Common math functions for game development
- Storage utilities (localStorage, sessionStorage wrappers)
- Animation utilities
- Asset loading helpers

## Usage

```typescript
import { createErrorHandler, formatCurrency } from '@vv-game-suite/utils';

// Use in your game components
const errorHandler = createErrorHandler({
  onError: (error) => console.error('Game error:', error)
});

// Format in-game currency
const displayValue = formatCurrency(playerBalance);
```

## Installation

```bash
npm install @vv-game-suite/utils
```