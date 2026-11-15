#!/usr/bin/env bash
# ==============================================================================
# ArthaOS - Turnkey GitHub Push Automation Script
# Usage: ./push_to_github.sh [OPTIONAL_REPO_URL]
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================"
echo "🚀 ArthaOS GitHub Deployment Helper"
echo "================================================================"

REPO_URL="$1"

if [ -z "$REPO_URL" ]; then
  echo ""
  echo "Enter your GitHub repository URL (HTTPS or SSH):"
  echo "Example: https://github.com/dheekshithchalla/artha-os.git"
  read -p "Repository URL: " REPO_URL
fi

if [ -z "$REPO_URL" ]; then
  echo "❌ Error: Repository URL cannot be empty."
  exit 1
fi

echo ""
echo "📦 Staging all files..."
git add .

echo "📝 Committing project snapshot..."
git commit -m "feat(artha-os): complete hackathon submission for Arthathon 2026 - AI for Finance" || echo "Working tree clean, proceeding..."

echo "🌿 Setting default branch to main..."
git branch -M main

echo "🔗 Configuring remote origin: $REPO_URL..."
if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "🚀 Pushing files to GitHub..."
git push -u origin main

echo ""
echo "================================================================"
echo "✅ SUCCESS! All files have been pushed to your GitHub repository:"
echo "   $REPO_URL"
echo "================================================================"
