import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

CustomUser = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user'] # CustomUser est récupéré via le middleware d'authentification
        if user.is_authenticated:
            self.user = user
            await sync_to_async(self.mark_user_online)()
            self.accept()
        else:
            self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'user'):
            await sync_to_async(self.mark_user_offline)()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Exemple de gestion d'envoi de message
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': self.user.username,
        }))

    def mark_user_online(self):
        self.user.is_online = True
        self.user.save()

    def mark_user_offline(self):
        self.user.is_online = False
        self.user.save()
