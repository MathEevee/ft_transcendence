from django.apps import AppConfig


class AutheConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authe'

    def ready(self):
        import apps.authe.signals  # Connexion des signaux