from collections import defaultdict, deque


user_sockets = {}
# user_sockets[username] = [...userWebsockets]
conversations = defaultdict(lambda: deque(maxlen=50))
conv_rooms = defaultdict(set)
