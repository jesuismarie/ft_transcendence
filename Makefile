ROOT_DIRECTORY 	:= $(shell git rev-parse --show-toplevel)

TRANSCENDENCE_NETWORK_NAME 			:= bridge-network-transcendence
MONITOR_COMPOSE 					:= $(ROOT_DIRECTORY)/devops/monitoring/docker-compose-monitoring.yml
TRANSCENDENCE_TOP_LEVEL_COMPOSE 	:= $(ROOT_DIRECTORY)/docker-compose-top-level.yml

network:
	docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) || exit 0

monitor: network
	docker-compose -f $(MONITOR_COMPOSE) build --no-cache
	docker-compose -f $(MONITOR_COMPOSE) up -d

up: monitor
	docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) build --no-cache
	docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) up -d

down:
	docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) down
	docker-compose -f $(MONITOR_COMPOSE) down

clean: down
	docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) stop
	docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) rm -f
	docker-compose -f $(MONITOR_COMPOSE) stop
	docker-compose -f $(MONITOR_COMPOSE) rm -f

fclean: clean
	docker image prune -f
	docker volume prune -f
	docker network rm $(TRANSCENDENCE_NETWORK_NAME) 2>/dev/null || true



.PHONY: network monitor up down clean fclean
