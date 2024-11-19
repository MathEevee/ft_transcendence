#!/bin/bash

# check postgres is active
if ! systemctl is-active --quiet postgresql; then
    echo "service postgresql starting..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# env_variables and secrets
set -o allexport
source .env
source secrets
set +o allexport

# check db already exist
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" == "1" ]; then
    echo "the database '$DB_NAME' already exist"
else
    # create db
    echo "creating database '$DB_NAME'..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

    # create db_user
    USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
    if [ "$USER_EXISTS" != "1" ]; then
        echo "creating database_user '$DB_USER'..."
        sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    else
        echo "database_user '$DB_USER' already exist."
    fi

    # Assigner les privilèges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
fi
