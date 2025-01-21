from collections import defaultdict, deque


user_sockets = {} # todo AXEL: au lieu d'enregistrer un websocket par username, enregister une liste de websocket par username
conversations = defaultdict(lambda: deque(maxlen=50))
online_users = set()
conv_rooms = defaultdict(set)
