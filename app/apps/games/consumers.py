import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .globals import user_sockets

class PongConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			if self.user.username not in user_sockets:
				user_sockets[self.user.username] = []
			if len(user_sockets[self.user.username]) == 0:
				print(f'{self.user.username} connected')
			user_sockets[self.user.username].append(self)
			self.send_to_all(f'{self.user.username} connected')
			await self.accept()
		else:
			await self.close()

	async def disconnect(self, close_code):
		user_sockets[self.user.username].remove(self)
		if len(user_sockets[self.user.username]) == 0:
			print(f'{self.user.username} disconnected')

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data['message']
		position = data['position']
		revball = data['revball']

		await self.send(text_data=json.dumps({
			'message': message,
			'position': position,
			'revball': revball,
		}))

	async def send_to_all(self, message):
		for socket in user_sockets:
			if socket != self.user.username:
				await socket.send(text_data=json.dumps({
					'message': message,
				}))