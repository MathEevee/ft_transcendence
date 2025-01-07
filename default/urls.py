from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
import apps.chat.routing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.home.urls')),
    path('profil/', include('apps.profil.urls')),
    path('games/', include('apps.games.urls')),
    path('chat/', include('apps.chat.urls')),
    # Redirect root URL to the home app
    path('', RedirectView.as_view(url='/home/', permanent=False)),
    # Voir pour changer authe et api/ qui correspond a l'authe
    path('authe/', include('apps.authe.urls')),
	path('api/', include('apps.authe.urls')),
    # path('ws/', include(apps.chat.routing.websocket_urlpatterns)),  # pour websockets
	# path('ws/', include('apps.chat.routing')),
]
