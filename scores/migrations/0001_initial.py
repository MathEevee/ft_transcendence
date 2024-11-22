# Generated by Django 5.1.3 on 2024-11-16 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PlayerStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('games_play', models.PositiveIntegerField(default=0)),
                ('games_win', models.PositiveIntegerField(default=0)),
                ('total_score', models.IntegerField(default=0)),
            ],
        ),
    ]
