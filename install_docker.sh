#!/bin/bash

set -e

echo ">>> Détection du système d'exploitation"
if [ -f /etc/debian_version ]; then
    DISTRO=$(grep -i "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    VERSION_CODENAME=$(grep -i "^VERSION_CODENAME=" /etc/os-release | cut -d= -f2 | tr -d '"')
elif [ -f /etc/lsb-release ] && grep -q "Ubuntu" /etc/lsb-release; then
    DISTRO="ubuntu"
    VERSION_CODENAME=$(grep -i "^DISTRIB_CODENAME=" /etc/lsb-release | cut -d= -f2)
else
    echo "Ce script est uniquement compatible avec Debian et Ubuntu."
    exit 1
fi

echo ">>> Mise à jour des packages existants"
sudo apt update && sudo apt upgrade -y

echo ">>> Désinstallation des anciennes versions de Docker (si présentes)"
sudo apt remove -y docker docker-engine docker.io containerd runc || true

echo ">>> Installation des dépendances nécessaires"
sudo apt install -y ca-certificates curl gnupg lsb-release

echo ">>> Ajout de la clé GPG officielle de Docker"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/$DISTRO/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo ">>> Ajout du dépôt Docker officiel"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$DISTRO \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo ">>> Installation de Docker et Docker Compose"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo ">>> Vérification des versions installées"
docker -v
docker compose version

echo ">>> Ajout de l'utilisateur courant au groupe Docker"
sudo usermod -aG docker $USER

echo ">>> Installation terminée"
echo "⚠️ Veuillez vous déconnecter et vous reconnecter pour que les modifications prennent effet."
