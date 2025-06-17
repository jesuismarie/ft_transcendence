include Makefile.mk

init:
	@git clone git@github.com:hovhannisyangevorg/secrets.git && rm -rf secrets/.git secrets/.gitignore secrets/README.md

.DEFAULT_GOAL := up

mup:
	@$(MAKE) --no-print-directory -C devops/monitoring up

mdown:
	@$(MAKE) --no-print-directory -C devops/monitoring down

mfclean:
	@$(MAKE) --no-print-directory -C devops/monitoring fclean

up-userservice:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) up -d --remove-orphans user-service

up: # mup
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) up -d --remove-orphans
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) rm -f ssl-generator

clean: # mclean
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --rmi local --remove-orphans

down: # mdown
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --remove-orphans

fclean: # mfclean
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --volumes --rmi all --remove-orphans

build:
	@$(MAKE) --no-print-directory -f Makefile.prod build

push:
	@$(MAKE) --no-print-directory -f Makefile.prod push

re: fclean up

.PHONY: re net rmnet mup mdown mfclean up down fclean build push
