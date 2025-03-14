#!/bin/bash

# Start the mock database container
DB_CONTAINER_ID=$(docker run -d -p 5432:5432 \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  postgres:latest)

# Start the mock cache container
CACHE_CONTAINER_ID=$(docker run -d -p 6379:6379 redis:latest)

# Wait for the database to be ready
sleep 5

# Export the container IDs to a context file
echo "{\"dbContainerId\": \"$DB_CONTAINER_ID\", \"cacheContainerId\": \"$CACHE_CONTAINER_ID\"}" > ./test/context/context.json