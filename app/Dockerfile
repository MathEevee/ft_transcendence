FROM python:3.11-slim

WORKDIR /app

# copy Python dependencies
COPY requirements.txt ./

# dependencies (gcc & libpq-dev for psycopg2) + requirements.txt
RUN apt update && apt upgrade -y && \
    apt install -y gcc libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apt purge -y gcc && \
    apt autoremove -y && apt-get clean

# copy project files
COPY . .

# scripts permissions
RUN chmod +x data/create_db.sh

CMD ["bash", "-c", "data/create_db.sh && python3 data/setup_db.py && python3 manage.py runserver 0.0.0.0:8000"]
