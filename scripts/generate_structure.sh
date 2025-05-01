#!/bin/bash

# Define the folder structure as an array
folders=(
  "game-suite"
  "game-suite/apps"
  "game-suite/apps/breakout-game"
  "game-suite/apps/breakout-game/public"
  "game-suite/apps/breakout-game/src"
  "game-suite/apps/breakout-game/src/assets"
  "game-suite/apps/breakout-game/src/components"
  "game-suite/apps/breakout-game/src/hooks"
  "game-suite/apps/breakout-game/src/pages"
  "game-suite/apps/breakout-game/src/scenes"
  "game-suite/apps/mock-api"
  "game-suite/apps/mock-api/src"
  "game-suite/packages"
  "game-suite/packages/ui"
  "game-suite/packages/locales"
  "game-suite/packages/config"
  "game-suite/packages/tokens"
  "game-suite/.github"
  "game-suite/.github/workflows"
)

# Create folders and add README.md to each
for folder in "${folders[@]}"; do
  mkdir -p "$folder"
  echo "# $(basename "$folder")" > "$folder/README.md"
done

# Create placeholder files for the structure
touch game-suite/apps/breakout-game/src/tailwind.config.js
touch game-suite/apps/breakout-game/vite.config.ts
touch game-suite/apps/breakout-game/index.html
touch game-suite/apps/mock-api/src/index.ts
touch game-suite/apps/mock-api/tsconfig.json
touch game-suite/turbo.json
touch game-suite/package.json
