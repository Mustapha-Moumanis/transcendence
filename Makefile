up:
	docker-compose -f docker-compose.yml up --build

build:
	docker-compose -f docker-compose.yml build

down:
	docker-compose -f docker-compose.yml down

start:
	docker-compose -f docker-compose.yml start

stop:
	docker-compose -f docker-compose.yml stop

restart:
	docker-compose -f docker-compose.yml restart

logs:
	docker-compose -f docker-compose.yml logs

ps:
	docker-compose -f docker-compose.yml ps

remove-all:
	docker rmi $$(docker images -aq) ; docker volume prune -f $$(docker volume ls -q) ; docker system prune -f 