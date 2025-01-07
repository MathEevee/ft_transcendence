import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from django.contrib.auth import get_user_model
# from asgiref.sync import sync_to_async

# CustomUser = get_user_model()



class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()
		print('new socket')
		print(f'User {self.scope["user"].username} connected')

	async def disconnect(self, close_code):
		await self.close()
		print('close socket')

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']
		print(f'Received message: {message}')
		await self.send(text_data=json.dumps({
			'message': message,
		}))

	async def send(self, text_data=None, bytes_data=None, close=False):
		return await super().send(text_data, bytes_data, close)