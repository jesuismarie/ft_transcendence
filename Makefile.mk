ROOT_DIRECTORY 						= $(shell git rev-parse --show-toplevel)

TRANSCENDENCE_NETWORK_NAME 			:= transcendence_bridge-network

PROJECT_NAME 						= transcendence
MONITORING_PROJECT_NAME 			= monitoring
MONITOR_COMPOSE 					= $(ROOT_DIRECTORY)/devops/monitoring/docker-compose-monitoring.yml
TRANSCENDENCE_TOP_LEVEL_COMPOSE 	= $(ROOT_DIRECTORY)/docker-compose-top-level.yml
