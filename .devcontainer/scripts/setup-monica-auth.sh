#!/bin/bash
echo "Setting up Monica authentication..."
if [ -n "$GITHUB_TOKEN" ]; then
  echo "GitHub token found, configuring..."
  gh auth setup-git
else
  echo "No GitHub token found. Please authenticate manually."
fi
