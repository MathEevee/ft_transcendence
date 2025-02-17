import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .globals import user_sockets, players_ready, players_winner_by_match, multi_player_games
from apps.authe.models import CustomUser, Tournament, PlayerEntry, MatchEntry, Match
from apps.games.models import Game, Player
from asgiref.sync import sync_to_async
from django.http import JsonResponse
from collections import defaultdict
from django.db import transaction


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
		if message == 'IAonly':
			self.send(text_data=json.dumps({
				'message': 'IAonly',
			}))
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
		# print("\033[31mtournament" + f'{data}' + "\033[0m")

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
			print("\033[31m" + f'{data}' + "\033[0m")

			# Récupérer le gagnant
			winner = await sync_to_async(lambda: CustomUser.objects.get(username=data['winner']), thread_sensitive=True)()
			players_winner_by_match[winner].append(winner)
			print("\033[31m" + f'{players_winner_by_match.values()}' + "\033[0m")

			# Déterminer le type de tournoi
			types = True if data['tournament_type'] == 'pong' else False

			# Récupérer le tournoi
			tournament = await sync_to_async(lambda: Tournament.objects.filter(type_pong=types).first(), thread_sensitive=True)()
			if not tournament:
				raise ValueError("Aucun tournoi trouvé.")

			# Récupérer les joueurs avec `.first()` pour éviter les erreurs
			player1 = await sync_to_async(lambda: CustomUser.objects.filter(username=data['player1']).first(), thread_sensitive=True)()
			player2 = await sync_to_async(lambda: CustomUser.objects.filter(username=data['player2']).first(), thread_sensitive=True)()

			if not player1 or not player2:
				raise ValueError("Un des joueurs n'existe pas dans la base de données.")

			# Supprimer les joueurs s'ils ne sont pas gagnants
			if player1 != winner:
				await sync_to_async(lambda: tournament.remove_player(player1), thread_sensitive=True)()
			if player2 != winner:
				await sync_to_async(lambda: tournament.remove_player(player2), thread_sensitive=True)()

			# Récupérer le premier match du tournoi
			match = await sync_to_async(lambda: tournament.get_first_match(), thread_sensitive=True)()
			if not match:
				raise ValueError("Aucun match trouvé dans ce tournoi.")

			# Supprimer le match
			await sync_to_async(lambda: match.delete(), thread_sensitive=True)()

			# Vérifier si on doit créer un nouveau match
			if len(players_winner_by_match) == 2:
				await sync_to_async(lambda: tournament.add_match(players_winner_by_match.popitem()[0], players_winner_by_match.popitem()[0]), thread_sensitive=True)()
				players_winner_by_match.clear()

			# Vérifier si le tournoi est terminé
			if await sync_to_async(lambda: tournament.match_entries.count(), thread_sensitive=True)() == 0:
				await sync_to_async(tournament.end, thread_sensitive=True)()
				await sync_to_async(lambda: tournament.set_winner(winner), thread_sensitive=True)()
				await self.send(text_data=json.dumps({
					'message': f'End tournament, the winner is {winner.username}',
				}))
				await sync_to_async(tournament.delete, thread_sensitive=True)()
				return

			await self.send_to_all('next_match')
			return
		await self.send_to_all(message, player, ball, playery, ballx, bally, score1, score2)


#SPACE BATTLE==========================================================================================================

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

	async def send_to_all(self, message, player=None, bullets=None, playerx=None, playery=None, bulletx=None, life=None, bullet=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'bullets': bullets,
				'x': playerx,
				'y': playery,
				'life': life,
				'bullet': bullet,
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
		await self.send_to_all(message, data.get('player'), data.get('bullets'), data.get('playerx'), data.get('playery'), data.get('bulletx'), data.get('life'), data.get('bullet'))

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

	async def send_to_all(self, message, player=None, bullets=None, playerx=None, playery=None, bulletx=None, life=None, bullet=None):
		for socket in user_sockets:
			await socket.send(text_data=json.dumps({
				'message': message,
				'player': player,
				'bullets': bullets,
				'x': playerx,
				'y': playery,
				'life': life,
				'bullet': bullet,
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
		if message == 'ready':
			players_ready[data['player']].append(data['player'])
			if len(players_ready) == 2:
				await self.send_to_all('start')
			return
		if message == 'end':
			print("\033[31m" + f'{data}' + "\033[0m")
			winner = await sync_to_async(CustomUser.objects.get)(username=data['winner'])
			players_winner_by_match[winner].append(winner)
			print("\033[31m" + f'{players_winner_by_match.values()}' + "\033[0m")
			if data['tournament_type'] == 'pong':
				types = True
			else:
				types = False
			tournament = await sync_to_async(lambda: Tournament.objects.filter(type_pong=types).first())()
			print("\033[31m" + f'{tournament}' + "\033[0m")
			if not tournament:
				await self.send_to_all('Tournament not found')
				return
			#delete match of the winner
			player1 = await sync_to_async(CustomUser.objects.filter(username=data['player1']).first, thread_sensitive=True)()
			player2 = await sync_to_async(CustomUser.objects.filter(username=data['player2']).first, thread_sensitive=True)()
			if not player1 or not player2:
				await self.send_to_all('Player not found')
				return
			if player1 == winner:
				await sync_to_async(lambda: tournament.remove_player(player2))()
			else:
				await sync_to_async(lambda: tournament.remove_player(player1))()
			match = await sync_to_async(lambda: tournament.get_first_match())()
			if not match:
				raise ValueError("Aucun match trouvé dans ce tournoi.")
			await sync_to_async(lambda: match.delete(), thread_sensitive=True)()
			if len(players_winner_by_match) == 2:
				# print("\033[31m" + f'{players_winner_by_match}' + "\033[0m")
				await sync_to_async(lambda: tournament.add_match(players_winner_by_match.popitem()[0], players_winner_by_match.popitem()[0]))()
				players_winner_by_match.clear()
			if await sync_to_async(lambda: tournament.match_entries.count())() == 0:
				await sync_to_async(tournament.end)()
				await sync_to_async(tournament.set_winner)(winner)
				await self.send(text_data=json.dumps({
					'message': 'end tournament the winner is ' + winner.username,
				}))
				#delete le tournoi
				await sync_to_async(tournament.delete)()
				return
			await self.send_to_all('next_match')
			print("\033[31m" + "sending next match" + "\033[0m")
			return
		await self.send_to_all(message, data.get('player'), data.get('bullets'), data.get('playerx'), data.get('playery'), data.get('bulletx'), data.get('life'), data.get('bullet'))

		
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
		print("\033[31m" + f'{self} disconnected' + "\033[0m")
	
		try:
			await self.send_to_all(f'{self.user.username} disconnected')
			await self.send(text_data=json.dumps({
				'message': f"{self.user.username} disconnected",
			}))
		except Exception as e:
			print("\033[33m" + f"Error sending disconnect message: {e}" + "\033[0m")

		# Debugging: Vérifier si self est dans la liste
		print("\033[34m" + f"multi_player_games before remove: {[id(obj) for obj in multi_player_games]}" + "\033[0m")
		print("\033[34m" + f"Current self id: {id(self)}" + "\033[0m")

		# Supprimer uniquement si présent
		if self in multi_player_games:
			multi_player_games.remove(self)
			print("\033[32m" + f'{self.user.username} removed from multi_player_games' + "\033[0m")
		else:
			print("\033[33m" + f'Warning: {self.user.username} was not in multi_player_games' + "\033[0m")

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



		