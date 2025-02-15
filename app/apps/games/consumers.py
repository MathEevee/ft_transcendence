import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .globals import user_sockets, players_ready, players_winner_by_match, multi_player_games
from apps.authe.models import CustomUser, Tournament, PlayerEntry, MatchEntry, Match
from apps.games.models import Game, Player
from asgiref.sync import sync_to_async
from django.http import JsonResponse


class PongConsumer(AsyncWebsocketConsumer):

	async def send_username_to_all(self):
		for socket in user_sockets:
			await self.send(text_data=json.dumps({
				'message': f'{socket.user.username} connected',
			}))
			if socket == self:
				continue
			await socket.send(text_data=json.dumps({
				'message': f'{self.user.username} connected',
			}))

	async def send_to_all(self, message, player=None, ball=None, playery=None, ballx=None, bally=None, score1=None, score2=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'ball': ball,
				'y': playery,
				'ballx': ballx,
				'bally': bally,
				'score1': score1,
				'score2': score2,
			}))

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			for socket in user_sockets:
				if socket.user.username == self.user.username:
					await self.send(text_data=json.dumps({
						'message': 'You are already connected',
					}))
					return
			if len(user_sockets) > 2:
				await self.send(text_data=json.dumps({
					'message': 'Too many players',
				}))
				return
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			await self.accept()
			user_sockets.append(self)
			await self.send_username_to_all()
		else:
			await self.close()

	async def disconnect(self, close_code):
		await self.send_to_all(f'{self.user.username} disconnected')
		await self.send(text_data=json.dumps({
			'message': f"{self.user.username} disconnected",
		}))
		print("\033[31m" + f'{self.user.username} disconnected' + "\033[0m")
		user_sockets.remove(self)
		await self.close()

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data['message']
		print("\033[31m" + f'{data}' + "\033[0m")
		if message == 'start':
			print('test')
			# game = await sync_to_async(Game.objects.create)(type=data['typegame'], nb_players_required=2, started_at = datetime.datetime.fromtimestamp(data['started_at'] / 1000))
			# username1 = await sync_to_async(CustomUser.objects.get)(username=data['player1'])
			# player1 = await sync_to_async(Player.objects.create)(user=username1, game=game, team=None, is_host=True, is_IA=False)
			# username2 = await sync_to_async(CustomUser.objects.get)(username=data['player2'])
			# player2 = await sync_to_async(Player.objects.create)(user=username2, game=game, team=None, is_host=False, is_IA=False)
		if message == 'end':
			print('test')

		if 'player' in data:
			player = data['player']
		else:
			player = None
		if 'ball' in data:
			ball = data['ball']
		else:
			ball = None
		if 'y' in data:
			playery = data['y']
		else:
			playery = None
		if 'ballx' in data:
			ballx = data['ballx']
		else:
			ballx = None
		if 'bally' in data:
			bally = data['bally']
		else:
			bally = None
		if 'score1' in data:
			score1 = data['score1']
		else:
			score1 = None
		if 'score2' in data:
			score2 = data['score2']
		else:
			score2 = None
		await self.send_to_all(message, player, ball, playery, ballx, bally, score1, score2)

class PongTournoiConsumer(AsyncWebsocketConsumer):

	async def send_username_to_all(self):
		for socket in user_sockets:
			await self.send(text_data=json.dumps({
				'message': f'{socket.user.username} connected',
			}))
			if socket == self:
				continue
			await socket.send(text_data=json.dumps({
				'message': f'{self.user.username} connected',
			}))

	async def send_to_all(self, message, player=None, ball=None, playery=None, ballx=None, bally=None, score1=None, score2=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'ball': ball,
				'y': playery,
				'ballx': ballx,
				'bally': bally,
				'score1': score1,
				'score2': score2,
			}))

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			for socket in user_sockets:
				if socket.user.username == self.user.username:
					await self.send(text_data=json.dumps({
						'message': 'You are already connected',
					}))
					return
			if len(user_sockets) > 2:
				await self.send(text_data=json.dumps({
					'message': 'Too many players',
				}))
				return
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			await self.accept()
			user_sockets.append(self)
			await self.send_username_to_all()
		else:
			await self.close()

	async def disconnect(self, close_code):
		await self.send_to_all(f'{self.user.username} disconnected')
		await self.send(text_data=json.dumps({
			'message': f"{self.user.username} disconnected",
		}))
		print("\033[31m" + f'{self.user.username} disconnected' + "\033[0m")
		user_sockets.remove(self)
		await self.close()

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data['message']
		print("\033[31mtournament" + f'{data}' + "\033[0m")

		if message == 'start':
			print('test')
			# game = await sync_to_async(Game.objects.create)(type=data['typegame'], nb_players_required=2, started_at = datetime.datetime.fromtimestamp(data['started_at'] / 1000))
			# username1 = await sync_to_async(CustomUser.objects.get)(username=data['player1'])
			# player1 = await sync_to_async(Player.objects.create)(user=username1, game=game, team=None, is_host=True, is_IA=False)
			# username2 = await sync_to_async(CustomUser.objects.get)(username=data['player2'])
			# player2 = await sync_to_async(Player.objects.create)(user=username2, game=game, team=None, is_host=False, is_IA=False)
		if message == 'ready':
			players_ready[data['player']].append(data['player'])
			if len(players_ready) == 2:
				await self.send_to_all('start')
			return
		if 'player' in data:
			player = data['player']
		else:
			player = None
		if 'ball' in data:
			ball = data['ball']
		else:
			ball = None
		if 'y' in data:
			playery = data['y']
		else:
			playery = None
		if 'ballx' in data:
			ballx = data['ballx']
		else:
			ballx = None
		if 'bally' in data:
			bally = data['bally']
		else:
			bally = None
		if 'score1' in data:
			score1 = data['score1']
		else:
			score1 = None
		if 'score2' in data:
			score2 = data['score2']
		else:
			score2 = None
		if message == 'end':
			players_winner_by_match[data['id']].append(data['winner'])
			current_match = await sync_to_async(Match.objects.get)(id=data['match_id'])
			current_match.set_winner()
			current_match.set_ended()
			current_match.save()
			if len(players_winner_by_match) == 2:
				player1 = await sync_to_async(CustomUser.objects.get)(username=players_winner_by_match[0])
				player2 = await sync_to_async(CustomUser.objects.get)(username=players_winner_by_match[1])
				tounament = await sync_to_async(Tournament.objects.get)(id=data['tournament_id'])
				tounament.create_next_match(player1, player2)
				players_winner_by_match.clear()
				players_ready.clear()
				tounament.save()
			return


		await self.send_to_all(message, player, ball, playery, ballx, bally, score1, score2)


class SpaceConsumer(AsyncWebsocketConsumer):

	async def send_username_to_all(self):
		for socket in user_sockets:
			await self.send(text_data=json.dumps({
				'message': f'{socket.user.username} connected',
			}))
			if socket == self:
				continue
			await socket.send(text_data=json.dumps({
				'message': f'{self.user.username} connected',
			}))

	async def send_to_all(self, message, player=None, ball=None, playery=None, ballx=None, bally=None, score1=None, score2=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'ball': ball,
				'y': playery,
				'ballx': ballx,
				'bally': bally,
				'score1': score1,
				'score2': score2,
			}))

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			for socket in user_sockets:
				if socket.user.username == self.user.username:
					await self.send(text_data=json.dumps({
						'message': 'You are already connected',
					}))
					return
			if len(user_sockets) > 2:
				await self.send(text_data=json.dumps({
					'message': 'Too many players',
				}))
				return
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			await self.accept()
			user_sockets.append(self)
			await self.send_username_to_all()
		else:
			await self.close()

	async def disconnect(self, close_code):
		await self.send_to_all(f'{self.user.username} disconnected')
		await self.send(text_data=json.dumps({
			'message': f"{self.user.username} disconnected",
		}))
		print("\033[31m" + f'{self.user.username} disconnected' + "\033[0m")
		user_sockets.remove(self)
		await self.close()

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data['message']
		print("\033[31m" + f'{data}' + "\033[0m")
		if message == 'start':
			print('test')
			# game = await sync_to_async


class SpaceTournoiConsumer(AsyncWebsocketConsumer):

	async def send_username_to_all(self):
		for socket in user_sockets:
			await self.send(text_data=json.dumps({
				'message': f'{socket.user.username} connected',
			}))
			if socket == self:
				continue
			await socket.send(text_data=json.dumps({
				'message': f'{self.user.username} connected',
			}))

	async def send_to_all(self, message, player=None, ball=None, playery=None, ballx=None, bally=None, score1=None, score2=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'ball': ball,
				'y': playery,
				'ballx': ballx,
				'bally': bally,
				'score1': score1,
				'score2': score2,
			}))

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			for socket in user_sockets:
				if socket.user.username == self.user.username:
					await self.send(text_data=json.dumps({
						'message': 'You are already connected',
					}))
					return
			if len(user_sockets) > 2:
				await self.send(text_data=json.dumps({
					'message': 'Too many players',
				}))
				return
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			await self.accept()
			user_sockets.append(self)
			await self.send_username_to_all()
		else:
			await self.close()

	async def disconnect(self, close_code):
		await self.send_to_all(f'{self.user.username} disconnected')
		await self.send(text_data=json.dumps({
			'message': f"{self.user.username} disconnected",
		}))
		print("\033[31m" + f'{self.user.username} disconnected' + "\033[0m")
		user_sockets.remove(self)
		await self.close()

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data['message']
		print("\033[31m" + f'{data}' + "\033[0m")

		await self.send_to_all(message)

		
class MultiPlayerConsumer(AsyncWebsocketConsumer):
	
	async def send_to_all(self, message, start=None, player=None,playerid=None,playerx=None, playery=None,ballx=None, bally=None, balldx=None, balldy=None, ballspeed=None):
		for socket in multi_player_games:
			await socket.send(text_data=json.dumps({
				'message': message,
				'start': start,
				'player': player,
				'playerid': playerid,
				'playerx': playerx,
				'playery': playery,
				'ballx': ballx,
				'bally': bally,
				'balldx': balldx,
				'balldy': balldy,
				'ballspeed': ballspeed,
			}))

	async def connect(self, *args, **kwargs):
		self.user = self.scope['user']
		# check is here
		if self.user.is_authenticated:
			await self.accept()
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			# if len(multi_player_games) > 4:
			# 	await self.send(text_data=json.dumps({
			# 		'message': 'Too many players',
			# 	}))
			# 	return
			print("\033[31m" + f'{self.user.username} connected game' + "\033[0m")
			multi_player_games.append(self)
			if (self.user.username == multi_player_games[0].user.username):
				await self.send(text_data=json.dumps({
					'message': 'player_id',
					'value': len(multi_player_games),
				}))
			else:
				await self.send(text_data=json.dumps({
					'message': 'player_id',
					'value': len(multi_player_games),
				}))
			await self.send_to_all(f'{self.user.username} connected')
		else:
			await self.close()

	async def disconnect(self, close_code):
		await self.send_to_all(f'{self.user.username} disconnected')
		await self.send(text_data=json.dumps({
			'message': f"{self.user.username} disconnected",
		}))
		print("\033[31m" + f'{self.user.username} disconnected' + "\033[0m")
		multi_player_games.remove(self)
		await self.close()

	async def receive(self, text_data):
		data = json.loads(text_data)

    	# Initialisation des variables avec des valeurs par défaut
		if 'message' in data:
			message = data['message']
		else:
			message = None
		if 'start' in data:
			start = data['start']
		else:
			start = None
		if 'player' in data:
			player = data['player']
		else:
			player = None
		if 'playerid' in data:
			playerid = data['playerid']
		else:
			playerid = None
		if 'playerx' in data:
			playerx = data['playerx']
		else:
			playerx = None
		if 'playery' in data:
			playery = data['playery']
		else:
			playery = None
		if 'ballx' in data:
			ballx = data['ballx']
		else:
			ballx = None
		if 'bally' in data:
			bally = data['bally']
		else:
			bally = None
		if 'balldx' in data:
			balldx = data['balldx']
		else:
			balldx = None
		if 'balldy' in data:
			balldy = data['balldy']
		else:
			balldy = None
		if 'ballspeed' in data:
			ballspeed = data['ballspeed']
		else:
			ballspeed = None
		# Initialisation de 'start' à None par défaut, ou à 'start' si le message est 'start'
		# Afficher les données reçues pour déboguer
		# print("\033[31m" + f'receive : {data}' + "\033[0m")

		# Appeler send_to_all avec les variables extraites
		await self.send_to_all(message,start, player,playerid, playerx, playery,ballx, bally, balldx, balldy, ballspeed)



		