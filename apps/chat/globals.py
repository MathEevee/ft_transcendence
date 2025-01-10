from collections import defaultdict, deque


user_sockets = {}
conversations = defaultdict(lambda: deque(maxlen=50))

