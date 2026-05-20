#!/bin/sh

# Source this file to activate the project venv and Kaggle credentials together.
PROJECT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

export KAGGLE_CONFIG_DIR="$PROJECT_DIR/.kaggle"
export KAGGLE_API_TOKEN="$PROJECT_DIR/.kaggle/access_token"
export PYTHONPATH="$PROJECT_DIR/src${PYTHONPATH:+:$PYTHONPATH}"

if [ -f "$PROJECT_DIR/.venv/bin/activate" ]; then
  . "$PROJECT_DIR/.venv/bin/activate"
else
  echo "No virtual environment found at $PROJECT_DIR/.venv"
  echo "Create one with: python -m venv .venv && . .venv/bin/activate && pip install -e ."
fi
