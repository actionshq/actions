#!/bin/bash
set -euo pipefail

SCRIPTS_PATH="$(dirname "$0")"

gh auth login -w -s "write:packages"
${SCRIPTS_PATH}/init.sh
