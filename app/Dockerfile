FROM python:3.11-slim

WORKDIR /app

# copy project files
COPY . .

# dependencies (gcc & libpq-dev for psycopg2)
# requirements.txt
# delete gcc & clean apt & cache apt
# scripts permissions
# move .env to app/.env
RUN apt update && \
    apt install -y --no-install-recommends gcc libpq-dev postgresql-client && \
    pip install --no-cache-dir -r requirements.txt && \
    apt purge -y gcc && apt autoremove -y && apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x data/wait_postgres.sh data/create_db.sh
    # # mv .env app/.env
    # if [ -f .env ]; then mv .env app/.env; else echo ".env not found, skipping move"; fi

CMD ["sh", "-c", "./data/wait_postgres.sh && ./data/create_db.sh && python data/setup_db.py && python -u manage.py runserver 0.0.0.0:8000"]
