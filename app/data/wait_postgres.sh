#!/bin/bash

set -e

host="$DB_HOST"
user="$DB_USER"
dbname="$DB_NAME"
password="$DB_PASSWORD"

echo "Waiting for PostgreSQL to be ready..."

until PGPASSWORD=$password psql -h "$host" -U "$user" -d "$dbname" -c '\q' 2>/dev/null; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"
