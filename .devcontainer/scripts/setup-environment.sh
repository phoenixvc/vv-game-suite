#!/bin/bash
echo "Setting up development environment..."

# Setup Monica authentication
if [ -n "ghu_7lU1cY1Yy9kapCYd6ZlbNBpCtp9USZ0oludB" ]; then
  echo "GitHub token found, configuring..."
  gh auth setup-git
else
  echo "No GitHub token found. Please authenticate manually."
fi

# Install additional Python packages
pip install --user pytest black isort pylint

# Install global npm packages
npm install -g typescript eslint prettier

# Setup git config
git config --global pull.rebase true
git config --global core.editor code --wait

echo "Environment setup complete!"
