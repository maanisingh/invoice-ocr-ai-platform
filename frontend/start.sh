#!/bin/bash
# Railway start script for frontend

# Serve the built files
npx serve -s dist -l ${PORT:-3000}
