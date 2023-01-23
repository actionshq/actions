#!/bin/bash
set -euo pipefail

npx ts-node-esm main.ts
cat Action.schema.json | npx json2ts > dist/types.d.ts
