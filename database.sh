#! /bin/zsh

# Load the environment variables for the database
# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Try to source the .env file
set -a
if ! source .env; then
    echo "Error: Failed to load environment variables from .env file"
    exit 1
fi
set +a

# Verify required environment variables are set
if [ -z "$POSTGRES_DATABASE_PASSWORD" ]; then
    echo "Error: POSTGRES_DATABASE_PASSWORD environment variable is not set"
    exit 1
fi

echo "Environment variables loaded successfully"

# Load the database container.
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=$POSTGRES_DATABASE_PASSWORD -d -p $DATABASE_PORT:5432 -v drizzle-postgres-data:/var/lib/postgresql/data postgres

