include Makefile.mk

net:
ifeq ($(OS),Windows_NT)
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 || ( \
		docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 \
	)
else
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || \
	docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1
endif

rmnet:
ifeq ($(OS),Windows_NT)
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 && ( \
		docker network rm $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 \
	) || (exit 0)
else
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 && \
	docker network rm $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || true
endif

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
