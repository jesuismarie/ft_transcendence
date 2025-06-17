include Makefile.mk

init:
	@git clone git@github.com:hovhannisyangevorg/secrets.git && rm -rf secrets/.git secrets/.gitignore secrets/README.md

.DEFAULT_GOAL := up

up:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) up -d --remove-orphans
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) rm -f ssl-generator

down:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --remove-orphans

clean:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --rmi local --remove-orphans

fclean:
	@docker-compose -f $(TRANSCENDENCE_TOP_LEVEL_COMPOSE) --project-name $(PROJECT_NAME) down --volumes --rmi all --remove-orphans

build:
	@$(MAKE) --no-print-directory -f Makefile.prod build

push:
	@$(MAKE) --no-print-directory -f Makefile.prod push

re: fclean up

.PHONY: up clean down fclean build push re init
