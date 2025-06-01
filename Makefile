ROOT_DIRECTORY 	:= $(shell git rev-parse --show-toplevel)

TRANSCENDENCE_NETWORK_NAME 			:= bridge-network-transcendence
MONITOR_COMPOSE 					:= $(ROOT_DIRECTORY)/devops/monitoring/docker-compose-monitoring.yml
TRANSCENDENCE_TOP_LEVEL_COMPOSE 	:= $(ROOT_DIRECTORY)/docker-compose-top-level.yml

sinit:
	git clone git clone git@github.com:hovhannisyangevorg/secrets.git secrets && rm -rf secrets/.git

network:
	docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) || exit 0
mup: net
	@$(MAKE) --no-print-directory -C devops/monitoring up

mdown:
	@$(MAKE) --no-print-directory -C devops/monitoring down

mfclean:
	@$(MAKE) --no-print-directory -C devops/monitoring fclean

# TODO: Add dependency from (mup).
up:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) up -d --remove-orphans

# TODO: Add dependency from (mdown).
down:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --remove-orphans

# TODO: Add dependency from (mfclean).
fclean:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --volumes --rmi all --remove-orphans

.PHONY: net rmnet mup mdown mfclean up down fclean
