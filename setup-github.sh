#!/bin/bash

echo "🚀 Setting up GitHub repository for My Keeps"
echo ""

# Check if repo exists
echo "Checking if repository exists..."
REPO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/noanitzan/my-keeps)

if [ "$REPO_STATUS" = "200" ]; then
  echo "✅ Repository exists!"
  echo ""
  echo "Pushing code..."
  git push -u origin main
else
  echo "❌ Repository doesn't exist yet."
  echo ""
  echo "Please create it first:"
  echo "1. Go to: https://github.com/new"
  echo "2. Repository name: my-keeps"
  echo "3. Description: Collection app for images, quotes, and poems"
  echo "4. Choose Public or Private"
  echo "5. DO NOT initialize with README, .gitignore, or license"
  echo "6. Click 'Create repository'"
  echo ""
  echo "Then run this script again, or run:"
  echo "  git push -u origin main"
fi

