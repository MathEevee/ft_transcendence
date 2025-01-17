# Generated by Django 5.1.3 on 2025-01-17 10:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authe', '0008_rename_player_tournament_players'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tournament',
            name='game',
        ),
        migrations.AlterField(
            model_name='tournament',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='players',
            field=models.ManyToManyField(related_name='tournament_players', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_winner', to=settings.AUTH_USER_MODEL),
        ),
    ]
