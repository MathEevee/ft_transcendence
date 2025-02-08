from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/pong/', consumers.PongConsumer.as_asgi()),
    path('ws/spacebattle/', consumers.SpaceConsumer.as_asgi()),
	path('ws/pong/tournament/', consumers.PongTournoiConsumer.as_asgi()),
	path('ws/spacebattle/tournament/', consumers.SpaceTournoiConsumer.as_asgi()),
    path('ws/pong/multiplayer/', consumers.MultiPlayerConsumer.as_asgi()),
]
