#!/bin/bash
npm install
npm install -g serve
# npm run serve
npm run build
serve -s dist