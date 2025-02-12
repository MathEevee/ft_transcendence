from pathlib import Path
from decouple import Config, RepositoryEnv
from django.urls import reverse_lazy
from django.contrib.messages import constants as message_constants

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# load env variables and secrets
env_conf = Config(RepositoryEnv(BASE_DIR / '.env'))
secrets_conf = Config(RepositoryEnv(BASE_DIR / 'secrets'))

#oauth2
OAUTH_UID = secrets_conf('OAUTH_UID')
OAUTH_SECRET = secrets_conf('OAUTH_SECRET')

# SITE_URL = env_conf('SITE_URL')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3t6@4euv&+e-7g$u_syy_9cd+de!x^cwe-57i_z*45v3hfnj(g'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

CSRF_TRUSTED_ORIGINS = [
    # f"http://{SITE_URL}:8080"
    "http://localhost:8080",
    "https://les-requetes-mystiques.fr",
]

ALLOWED_HOSTS = [
    # SITE_URL,
    'les-requetes-mystiques.fr',
    'localhost',
    '127.0.0.1',
    '172.0.18.1',
    'backend',
    'nginx'
]

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django_extensions',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.oauth2',
    'rest_framework',
    'channels',
    'apps.authe',
    'apps.home',
    'apps.profil',
    'apps.games',
    'apps.chat',
]

LOGIN_URL = reverse_lazy('authe:login')
LOGIN_REDIRECT_URL = "user_profile"
LOGOUT_REDIRECT_URL = LOGIN_URL

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'default.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'apps.authe.context_processors.staff_status',
            ],
        },
    },
]

WSGI_APPLICATION = 'default.wsgi.application'
ASGI_APPLICATION = 'default.asgi.application'


# Database
# # https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env_conf('DB_NAME'),
        'USER': secrets_conf('DB_USER'),
        'PASSWORD': secrets_conf('DB_PASSWORD'),
        'HOST': env_conf('DB_HOST'),
        'PORT': env_conf('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'authe.CustomUser'


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_L10N = True
USE_TZ = True

APPEND_SLASH = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# config site for allauth
SITE_ID = 1

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

MESSAGE_TAGS = {
    message_constants.DEBUG: 'debug',
    message_constants.INFO: 'info',
    message_constants.SUCCESS: 'success',
    message_constants.WARNING: 'warning',
    message_constants.ERROR: 'error',
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}