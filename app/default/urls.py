from django.contrib import admin
from django.urls import path, include
# import apps.chat.routing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authe/', include('apps.authe.urls')),
    path('chat/', include('apps.chat.urls')),
    path('games/', include('apps.games.urls')),
    path('', include('apps.home.urls')),
    path('profil/', include('apps.profil.urls')),
    # path('ws/', include(apps.chat.routing.websocket_urlpatterns)),  # pour websockets
	# path('ws/', include('apps.chat.routing'))
]
