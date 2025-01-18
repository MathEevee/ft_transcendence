FROM python:3.11-slim

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev gcc bash && \
    apt-get clean

WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le projet dans l'image, y compris les scripts
COPY . .

# Rendre les scripts exécutables
RUN chmod +x data/create_db.sh

# Variables d’environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Commande par défaut
CMD ["bash", "-c", "data/create_db.sh && python3 data/setup_db.py && python3 manage.py runserver 0.0.0.0:8000"]
