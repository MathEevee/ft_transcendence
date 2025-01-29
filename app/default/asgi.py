import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apps.chat.routing
import apps.games.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'default.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns + apps.games.routing.websocket_urlpatterns
        )
    ),
})
