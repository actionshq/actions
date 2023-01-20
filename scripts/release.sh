#!/bin/bash
set -euo pipefail

GITHUB_TOKEN=$(gh auth token) npm publish
