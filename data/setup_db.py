import os
import subprocess
import django

# init Django Env
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "default.settings")
django.setup()

from django.core.management import call_command
from django.db import IntegrityError
from accounts.models import CustomUser
from scores.models import PlayerStats

# create database if not exist
def create_database(db_name, db_user):
    try:
        # check if database exist
        subprocess.run(
            ["psql", "-U", db_user, "-c", f"SELECT 1 FROM pg_database WHERE datname='{db_name}';"],
            check=True,
            text=True,
        )
        print(f"Database '{db_name}' already exists.")
    except subprocess.CalledProcessError:
        # create database
        print(f"Creating database '{db_name}'...")
        subprocess.run(
            ["psql", "-U", db_user, "-c", f"CREATE DATABASE {db_name};"],
            check=True,
            text=True,
        )
        print(f"Database '{db_name}' created successfully.")

def setup_database():
    # 0 : create database if not exist
    create_database("transcendance_db", "postgres")

    # 1 : execute makemigrations and migrate
    print("Applying migrations...")
    call_command("makemigrations", interactive=False)
    call_command("migrate", interactive=False)

    # 2 : create objects for table 'CustomUser'
    print("Creating users...")
    try:
        CustomUser.objects.create_superuser(
            username="ajas",
            email="ajas@example.com",
            password="SuperPower",
        )
        CustomUser.objects.create_user(
            username="yoda",
            email="yoda@example.com",
            password="TheForce",
        )
        CustomUser.objects.create_user(
            username="luke",
            email="luke@example.com",
            password="StarKiller",
        )
    except IntegrityError:
        print("Users already exist, skipping user creation.")

    # 3 : create objects for table 'PlayerStats'
    print("Creating scores...")
    try:
        PlayerStats.objects.create(
            username="yoda",
            games_play=10,
            games_win=7,
            total_score=150
        )
        PlayerStats.objects.create(
            username="luke",
            games_play=12,
            games_win=9,
            total_score=200
        )
    except IntegrityError:
        print("Scores already exist, skipping score creation.")

    print("Database setup complete!")

if __name__ == "__main__":
    setup_database()
