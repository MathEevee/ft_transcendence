from collections import defaultdict, deque

user_sockets = []
multi_scokets = []

players_ready = defaultdict(deque)
players_winner_by_match = defaultdict(deque)
