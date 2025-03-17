#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Replace placeholders in the template with environment variables
envsubst < init.sql.template > init.sql

echo "Generated init.sql with environment variables."