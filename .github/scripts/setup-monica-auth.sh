#!/bin/bash

# Setup script for Monica authentication in Codespaces
echo "Setting up Monica authentication..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI not found, installing..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update
    sudo apt install gh
fi

# Check GitHub authentication status
if ! gh auth status &> /dev/null; then
    echo "Not authenticated with GitHub. Please authenticate:"
    gh auth login
else
    echo "Already authenticated with GitHub"
fi

# Set up Git credentials
git config --global credential.helper store
gh auth setup-git

# Verify Monica extension
if code --list-extensions | grep -q "github.monica"; then
    echo "Monica extension is installed"
else
    echo "Installing Monica extension..."
    code --install-extension github.monica
fi

echo "Monica authentication setup complete!"
