from collections import defaultdict, deque


user_sockets = {}
conversations = defaultdict(lambda: deque(maxlen=50))
online_users = set()
conv_rooms = defaultdict(set)
