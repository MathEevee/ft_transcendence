SHELL := /bin/bash

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -f
	docker volume prune -f

rebuild:
	make clean
	make up

init_data:
	docker exec -it ft_backend bash -c "data/create_db.sh"
	docker exec -it ft_backend python3 data/setup_db.py

migrate:
	docker exec -it ft_backend python3 manage.py makemigrations
	docker exec -it ft_backend python3 manage.py migrate

superuser:
	docker exec -it ft_backend python3 manage.py createsuperuser
