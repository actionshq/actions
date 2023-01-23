#!/bin/bash
set -euo pipefail

mkdir -p dist
cat Action.schema.json | npx json2ts > dist/types.d.ts
npx ts-node-esm main.ts
