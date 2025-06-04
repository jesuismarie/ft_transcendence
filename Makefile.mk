ROOT_DIRECTORY 						= $(shell git rev-parse --show-toplevel)

TRANSCENDENCE_NETWORK_NAME 			:= transcendence_bridge-network

PROJECT_NAME 						= transcendence
MONITORING_PROJECT_NAME 			= monitoring
MONITOR_COMPOSE 					= $(ROOT_DIRECTORY)/devops/monitoring/docker-compose-monitoring.yml
TRANSCENDENCE_TOP_LEVEL_COMPOSE 	= $(ROOT_DIRECTORY)/docker-compose-top-level.yml




#devops prod

DOCKER_HUB_USER                 = hovhannisyangevorg
TAG                             = latest
SERVICE_AUTH_CONTEXT            = .

BACKEND_DIR                     = backend
FRONTEND_DIR                    = frontend

AUTH_SERVICE_DIR                = auth-service
GAME_SERVICE_DIR                = game-service
PONG_SERVICE_DIR                = pong-service
PROXY_SERVICE_DIR               = proxy-service
USER_SERVICE_DIR                = user-service

FRONTEND_SERVICE_DOCKER_PATH    = $(FRONTEND_DIR)/Dockerfile
AUTH_SERVICE_DOCKER_PATH        = $(BACKEND_DIR)/$(AUTH_SERVICE_DIR)/Dockerfile
GAME_SERVICE_DOCKER_PATH        = $(BACKEND_DIR)/$(GAME_SERVICE_DIR)/Dockerfile
PONG_SERVICE_DOCKER_PATH        = $(BACKEND_DIR)/$(PONG_SERVICE_DIR)/Dockerfile
PROXY_SERVICE_DOCKER_PATH       = $(BACKEND_DIR)/$(PROXY_SERVICE_DIR)/Dockerfile
USER_SERVICE_DOCKER_PATH        = $(BACKEND_DIR)/$(USER_SERVICE_DIR)/Dockerfile

FRONTEND_SERVICE_IMAGE_NAME     = $(DOCKER_HUB_USER)/$(FRONTEND_DIR):$(TAG)
AUTH_SERVICE_IMAGE_NAME         = $(DOCKER_HUB_USER)/$(AUTH_SERVICE_DIR):$(TAG)
GAME_SERVICE_IMAGE_NAME         = $(DOCKER_HUB_USER)/$(GAME_SERVICE_DIR):$(TAG)
PONG_SERVICE_IMAGE_NAME         = $(DOCKER_HUB_USER)/$(PONG_SERVICE_DIR):$(TAG)
PROXY_SERVICE_IMAGE_NAME        = $(DOCKER_HUB_USER)/$(PROXY_SERVICE_DIR):$(TAG)
USER_SERVICE_IMAGE_NAME         = $(DOCKER_HUB_USER)/$(USER_SERVICE_DIR):$(TAG)
