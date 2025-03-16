#!/bin/bash

if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found."
  exit 1
fi

DB_CONTAINER_ID=$(docker run -d \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  postgres:latest)

if [ -z "$DB_CONTAINER_ID" ]; then
  echo "Failed to start the database container."
  exit 1
fi

CACHE_CONTAINER_ID=$(docker run -d \
  --network test-network \
  redis:latest)

if [ -z "$CACHE_CONTAINER_ID" ]; then
  echo "Failed to start the cache container."
  exit 1
fi

echo "Waiting for the database to start..."
for i in {1..30}; do
  if docker exec $DB_CONTAINER_ID pg_isready -U $POSTGRES_USER -d $POSTGRES_DB; then
    echo "Database is ready!"
    break
  fi
  sleep 1
done