FROM python:3.11-slim

WORKDIR /app

# copy project files
COPY . .

# dependencies (gcc & libpq-dev for psycopg2)
# requirements.txt
# delete gcc & clean apt & cache apt
# scripts permissions
RUN apt update && \
    apt install -y --no-install-recommends gcc libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apt purge -y gcc && apt autoremove -y && apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x wait_postgres.sh create_db.sh

CMD ["sh", "-c", "./data/wait_postgres.sh && ./data/create_db.sh && python data/setup_db.py && python manage.py runserver 0.0.0.0:8000"]
