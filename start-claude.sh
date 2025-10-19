#!/bin/bash

echo "--- Starting Daytona Task ---"

if [ -z "$GIT_REPO_URL" ] || [ -z "$GIT_BRANCH_NAME" ]; then
    echo "Error: GIT_REPO_URL and GIT_BRANCH_NAME must be set."
    exit 1
fi

# Configure git credentials if GITHUB_PAT is provided
if [ -n "$GITHUB_PAT" ]; then
    echo "Configuring git credentials..."
    git config --global credential.helper store
    echo "https://x-access-token:${GITHUB_PAT}@github.com" > ~/.git-credentials
fi

echo "Cloning ${GIT_REPO_URL} and checking out ${GIT_BRANCH_NAME}..."
git clone "${GIT_REPO_URL}" .
git checkout "${GIT_BRANCH_NAME}"

echo "Installing backend dependencies..."
cd backend
npm install

echo "Starting claude-code-webui backend server..."
# Use --host 0.0.0.0 to make it accessible from outside the container
npm run start -- --host 0.0.0.0
