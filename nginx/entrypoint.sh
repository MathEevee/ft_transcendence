#!/bin/sh

SSL_DIR="/etc/nginx/ssl"
CRT_FILE="$SSL_DIR/transcendence.crt"
KEY_FILE="$SSL_DIR/transcendence.key"

if [ ! -f "$CRT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "📢 Certificats SSL manquants, génération en cours..."
    mkdir -p "$SSL_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY_FILE" -out "$CRT_FILE" \
        -subj "/CN=les-requetes-mystiques.fr"
    echo "✅ Certificats SSL générés."
else
    echo "✅ Certificats SSL déjà présents."
fi

echo "🚀 Lancement de Nginx..."
exec nginx -g "daemon off;"
