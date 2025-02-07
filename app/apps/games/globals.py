from collections import defaultdict, deque

user_sockets = []

players_ready = defaultdict(deque)
players_winner_by_match = defaultdict(deque)
