SHELL := /bin/bash

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -f --volumes

rebuild:
	make clean
	make up

init_data:
	docker exec -it ft_transcendence_backend bash -c "data/create_db.sh"
	docker exec -it ft_transcendence_backend python3 data/setup_db.py

migrate:
	docker exec -it ft_transcendence_backend python3 manage.py makemigrations
	docker exec -it ft_transcendence_backend python3 manage.py migrate

superuser:
	docker exec -it ft_transcendence_backend python3 manage.py createsuperuser

# Supprimer uniquement les volumes spécifiques
clean_volumes:
	docker volume rm ft_transcendence_db-postgres
