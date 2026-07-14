from pathlib import Path
from decouple import config, Csv
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ─────────────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY', default='django-insecure-dev-key-change-in-production')
DEBUG      = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*', cast=Csv())

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'django.contrib.sites',
    # Third party
    'rest_framework',
    'corsheaders',
    # Our app
    'calculators',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',       # ← static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ── Database ─────────────────────────────────────────────────────
# Development: SQLite
# Production:  PostgreSQL (set DATABASE_URL in .env)
DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME':    BASE_DIR / 'db.sqlite3',
        }
    }

# ── Password Validation ──────────────────────────────────────────
# Django hashes passwords automatically using PBKDF2 + SHA256
# These validators enforce strong passwords for admin users
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 12}},                   # minimum 12 chars
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Localisation ─────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'Asia/Kathmandu'
USE_I18N      = True
USE_TZ        = True

# ── Static & Media Files ─────────────────────────────────────────
STATIC_URL   = '/static/'
STATIC_ROOT  = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL    = '/media/'
MEDIA_ROOT   = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SITE_ID = 1

# ── CORS ─────────────────────────────────────────────────────────
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = config(
        'CORS_ALLOWED_ORIGINS',
        default='https://calculatorsnexus.com',
        cast=Csv()
    )

CORS_ALLOW_METHODS = ['GET', 'OPTIONS']      # read-only API — no POST/DELETE
CORS_ALLOW_HEADERS = ['Content-Type', 'Accept']

# ── Django REST Framework ─────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',        # no browsable API in production
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '200/hour',                            # 200 requests per hour per IP
    },
}

# ── Security Headers (production only) ───────────────────────────
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER          = True
    SECURE_CONTENT_TYPE_NOSNIFF        = True
    SECURE_HSTS_SECONDS                = 31536000      # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS     = True
    SECURE_HSTS_PRELOAD                = True
    SECURE_SSL_REDIRECT                = True
    SESSION_COOKIE_SECURE              = True
    CSRF_COOKIE_SECURE                 = True
    X_FRAME_OPTIONS                    = 'DENY'

# ── Logging ──────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style':  '{',
        },
    },
    'handlers': {
        'console': {
            'class':     'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level':    'WARNING',
    },
    'loggers': {
        'django': {
            'handlers':  ['console'],
            'level':     'WARNING',
            'propagate': False,
        },
    },
}

# ── Site Info ─────────────────────────────────────────────────────
SITE_NAME        = config('SITE_NAME', default='CalculatorsNexus')
SITE_URL         = config('SITE_URL',  default='http://localhost:3000')
SITE_DESCRIPTION = 'Free online calculators for everyone — finance, health, math, business and more.'
