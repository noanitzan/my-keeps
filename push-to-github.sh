#!/bin/bash

# Script to push My Keeps to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
  echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
  echo "Example: ./push-to-github.sh noani"
  exit 1
fi

GITHUB_USER=$1
REPO_NAME="my-keeps"

echo "🚀 Setting up GitHub repository..."

# Add remote (will fail if repo doesn't exist, that's okay)
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "📝 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: ${REPO_NAME}"
echo "3. Description: Collection app for images, quotes, and poems"
echo "4. Make it Public or Private (your choice)"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
echo "Then run this command to push:"
echo "  git push -u origin main"
echo ""
echo "Or if you want me to try pushing now (will fail if repo doesn't exist yet):"
read -p "Try to push now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git push -u origin main
fi

