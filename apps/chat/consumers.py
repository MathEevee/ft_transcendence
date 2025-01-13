import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.chat.globals import user_sockets, conversations, online_users, conv_rooms
from apps.authe.models import CustomUser
from asgiref.sync import sync_to_async
# from django.contrib.auth import get_user_model
# from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			user_sockets[self.user.username] = self
			await sync_to_async(CustomUser.objects.filter(username=self.user.username).update)(is_online=True)
			print(f'{self.user.username} connected')
			online_users.add(self.user.username)
			await self.accept()
		else:
			await self.close()

	async def disconnect(self, close_code):
		if self.user.username in user_sockets:
			del user_sockets[self.user.username]
			online_users.remove(self.user.username)
			await sync_to_async(CustomUser.objects.filter(username=self.user.username).update)(is_online=False)
			print(f'{self.user.username} disconnected')

	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
			message = data['message']
			to_user = data['to']

			if to_user in user_sockets:
				conversation_key = tuple(sorted([self.user.username, to_user]))

				conversations[conversation_key].append({
					'from': self.user.username,
					'to': to_user,
					'message': message
				})

				recipient_socket = user_sockets[to_user]
				await recipient_socket.send(text_data=json.dumps({
					'message': message,
					'from': self.user.username,
					'to': to_user,
					'all_messages': list(conversations[conversation_key])
				}))

				await self.send(text_data=json.dumps({
					'conversation': list(conversations[conversation_key])
				}))
			else:
				await self.send(text_data=json.dumps({
					'message': to_user + ' is not connected',
					'from': 'admin',
					'to': self.user.username
				}))
		except Exception as e:
			print(f"Error in receive: {e}")
			await self.send(text_data=json.dumps({
				'message': 'An error occurred',
				'from': 'admin',
				'to': self.user.username
			}))
