#!/bin/bash
set -e

echo "Starting Employee Task Backend..."
echo "Environment: ${SPRING_PROFILES_ACTIVE:-default}"
echo "Port: ${SERVER_PORT:-4000}"

exec "$@"
