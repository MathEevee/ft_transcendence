from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('app.urls')),
    # path('accounts/', include('accounts.urls')),
    # path('scores/', include('scores.urls')),
    path('authe/', include('apps.authe.urls')),
    path('', include('apps.home.urls')),
    path('profil/', include('apps.profil.urls')),
    path('game/', include('apps.game.urls')),
    # Redirect root URL to the home app
    path('', RedirectView.as_view(url='/home/', permanent=False)),
]
