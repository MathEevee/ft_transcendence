# Generated by Django 5.1.3 on 2025-01-17 13:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authe', '0004_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='RelationsShips',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField(default=None)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
