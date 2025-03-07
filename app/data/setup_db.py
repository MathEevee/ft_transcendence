import os
import django
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# init Django Env
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "default.settings")
django.setup()

from django.core.management import call_command
from django.db import IntegrityError
from apps.authe.models import CustomUser
# from scores.models import PlayerStats

def setup_database():
    # 1 : execute makemigrations and migrate
    print("applying migrations...")
    call_command("makemigrations", interactive=False)
    call_command("migrate", interactive=False)

    # 2 : create objects for table 'CustomUser'
    print("creating users...")
    try:
        CustomUser.objects.create_superuser(
            username=os.getenv("USERNAME1"),
            email=os.getenv("EMAIL1"),
            password=os.getenv("PASSWORD1"),
            profil_picture=" /static/pictures/user-avatar-01.png"
        )
        CustomUser.objects.create_user(
            username=os.getenv("USERNAME2"),
            email=os.getenv("EMAIL2"),
            password=os.getenv("PASSWORD2"),
            profil_picture=" /static/pictures/user-avatar-02.png"
        )
        CustomUser.objects.create_user(
            username=os.getenv("USERNAME3"),
            email=os.getenv("EMAIL3"),
            password=os.getenv("PASSWORD3"),
            profil_picture=" /static/pictures/user-avatar-03.png"
        )
    except IntegrityError:
        print("users already exist, skipping user creation.")

    # # 3 : create objects for table 'PlayerStats'
    # print("creating scores...")
    # try:
    #     PlayerStats.objects.create(
    #         username="yoda",
    #         games_play=10,
    #         games_win=7,
    #         total_score=150
    #     )
    #     PlayerStats.objects.create(
    #         username="luke",
    #         games_play=12,
    #         games_win=9,
    #         total_score=200
    #     )
    # except IntegrityError:
    #     print("scores already exist, skipping score creation.")

    print("database setup complete!")

if __name__ == "__main__":
    setup_database()
