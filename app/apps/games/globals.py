from collections import defaultdict, deque

user_sockets = []
multi_player_games = []

players_ready_space = defaultdict(deque)
players_ready_pong = defaultdict(deque)
players_winner_by_match_space = defaultdict(deque)
players_winner_by_match_pong = defaultdict(deque)
