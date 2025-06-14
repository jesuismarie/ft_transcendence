include Makefile.mk

init:
ifeq ($(OS),Windows_NT)
	@powershell -Command "git clone git@github.com:hovhannisyangevorg/secrets.git; Remove-Item -Recurse -Force secrets/.git, secrets/.gitignore, secrets/README.md"
else
	@git clone git@github.com:hovhannisyangevorg/secrets.git && rm -rf secrets/.git secrets/.gitignore secrets/README.md
endif

net:
ifeq ($(OS),Windows_NT)
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 || ( \
		@docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) >nul 2>&1 \
	)
else
	@docker network inspect $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1 || \
	@docker network create --driver bridge $(TRANSCENDENCE_NETWORK_NAME) >/dev/null 2>&1
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

.DEFAULT_GOAL := up

mup: net
	@$(MAKE) --no-print-directory -C devops/monitoring up

mdown:
	@$(MAKE) --no-print-directory -C devops/monitoring down

mfclean:
	@$(MAKE) --no-print-directory -C devops/monitoring fclean

# TODO: Add dependency from (net, mup, init) dont push secrets on repo set rull (init).
up: net
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) up -d --remove-orphans && @docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) rm -f ssl-generator

# TODO: Add dependency from (mdown).
down:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --remove-orphans

# TODO: Add dependency from (mfclean).
fclean:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --volumes --rmi all --remove-orphans

build:
	@$(MAKE) --no-print-directory -f Makefile.prod build

push:
	@$(MAKE) --no-print-directory -f Makefile.prod push

.PHONY: net rmnet mup mdown mfclean up down fclean build push
