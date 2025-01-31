import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.chat.globals import user_sockets, conversations, conv_rooms
from apps.authe.models import CustomUser
from asgiref.sync import sync_to_async
# from django.contrib.auth import get_user_model
# from asgiref.sync import sync_to_async
from apps.chat.models import Relationship
from django.db.models import Q

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			if self.user.username not in user_sockets:
				user_sockets[self.user.username] = []	
			if len(user_sockets[self.user.username]) == 0:
				await sync_to_async(CustomUser.objects.filter(username=self.user.username).update)(is_online=True)
				await sync_to_async(self.update_online_status)(True)
				print("\033[31m" + f'{self.user.username} connected chat' + "\033[0m")
			user_sockets[self.user.username].append(self)
			await self.accept()
		else:
			await self.close()

	async def disconnect(self, close_code):
		user_sockets[self.user.username].remove(self)
		if len(user_sockets[self.user.username]) == 0:
			await sync_to_async(CustomUser.objects.filter(username=self.user.username).update)(is_online=False)
			await sync_to_async(self.update_online_status)(False)
			print(f'{self.user.username} disconnected')

	def update_online_status(self, status):
		friends = Relationship.objects.filter(Q(target=self.user) & Q(relations='friend'))
		for relation in friends:
			user = relation.user
			if user.username in user_sockets and len(user_sockets[user.username]) != 0:
				for socket in user_sockets[user.username]:
					asyncio.run(socket.send(text_data=json.dumps({
						'status' : status,
						'user' : self.user.username,
					})))

	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
			message = data['message']
			to_user = data['to']
			if 'is_invite' in data:
				is_invite = data['is_invite']
				if data['tournament'] == True:
					tournamentType = data['message'].split(':')[1]
					is_tournament = True
				else:
					tournamentType = 'None'
					is_tournament = False
			else:
				is_invite = False
				tournamentType = 'None'
				is_tournament = False

			if to_user in user_sockets and len(user_sockets[to_user]) != 0:
				conversation_key = tuple(sorted([self.user.username, to_user]))

				conversations[conversation_key].append({
					'from': self.user.username,
					'to': to_user,
					'message': message,
					'invitation': is_invite,
					'is_tournament': is_tournament,
					'tournamentType': tournamentType
				})

				for socket in user_sockets[to_user]:
					await socket.send(text_data=json.dumps({
						'message': message,
						'from': self.user.username,
						'to': to_user,
						'all_messages': list(conversations[conversation_key]),
						'invitation': is_invite,
						'is_tournament': is_tournament,
						'tournamentType': tournamentType
					}))
				
				await self.send(text_data=json.dumps({
					'conversation': list(conversations[conversation_key])
				}))
			else:
				await self.send(text_data=json.dumps({
					'message': to_user + ' is not connected',
					'from': 'admin',
					'to': self.user.username,
					'invitation': is_invite,
					'is_tournament': is_tournament,
					'tournamentType': tournamentType
				}))
		except Exception as e:
			print(f"Error in receive: {e}")
			await self.send(text_data=json.dumps({
				'message': 'An error occurred',
				'from': 'admin',
				'to': self.user.username,
				'invitation': is_invite,
				'is_tournament': is_tournament,
				'tournamentType': tournamentType
			}))
