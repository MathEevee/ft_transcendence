from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authe/', include('apps.authe.urls')),
    path('', include('apps.home.urls')),
    path('profil/', include('apps.profil.urls')),
    path('games/', include('apps.games.urls')),
    # Redirect root URL to the home app
    path('', RedirectView.as_view(url='/home/', permanent=False)),
]
