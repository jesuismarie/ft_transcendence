include ../../Makefile.mk

net:
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1

rmnet:
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 && docker network rm $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || true

up: net
	@docker-compose -f $(MONITOR_COMPOSE) --project-name $(MONITORING_PROJECT_NAME) up -d --remove-orphans

down:
	@docker-compose -f $(MONITOR_COMPOSE) --project-name $(MONITORING_PROJECT_NAME) down --remove-orphans

fclean: down rmnet
	@docker-compose -f $(MONITOR_COMPOSE) --project-name $(MONITORING_PROJECT_NAME) down --volumes --rmi all --remove-orphans

re: fclean up