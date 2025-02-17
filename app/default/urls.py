from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authe/', include('apps.authe.urls')),
    path('chat/', include('apps.chat.urls')),
    path('games/', include('apps.games.urls')),
    path('', include('apps.home.urls')),
    path('profil/', include('apps.profil.urls')),

    # favicon
    path('favicon.ico', RedirectView.as_view(url='/static/pictures/favicon.ico', permanent=True)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
