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

def setup_database():
    # 1 : execute makemigrations and migrate
    print("applying migrations...")
    call_command("makemigrations", interactive=False)
    call_command("migrate", interactive=False)

    # 2 : create objects for table 'CustomUser'
    print("creating users...")
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
        print("users already exist, skipping user creation.")

    # 3 : create objects for table 'PlayerStats'
    print("creating scores...")
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
        print("scores already exist, skipping score creation.")

    print("database setup complete!")

if __name__ == "__main__":
    setup_database()
