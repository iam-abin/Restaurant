# Variables
DOCKER_COMPOSE = docker compose
COMPOSE_FILE_DEVELOPMENT = docker-compose.dev.yaml
COMPOSE_FILE_PRODUCTION = docker-compose.prod.yaml

# Targets (.PHONY tells make the target is a command, not a file)
.PHONY: help up-dev up-dev-non up-prod up-prod-non down-dev down-prod restart-dev restart-prod

# Default target
.DEFAULT_GOAL := help

# Default action (ie, make or make help)
help:
	@echo "Available commands:"
	@echo "  make up-dev        Start development services (detached)"
	@echo "  make up-dev-non    Start development services (non-detached)"
	@echo "  make up-prod       Start production services (detached)"
	@echo "  make up-prod-non   Start production services (non-detached)"
	@echo "  make down-dev      Stop development services"
	@echo "  make down-prod     Stop production services"
	@echo "  make restart-dev   Restart development services"
	@echo "  make restart-prod  Restart production services"


# Start development services (detached)
up-dev:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEVELOPMENT) up --build -d

# Start development services (non-detached)
up-dev-non:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEVELOPMENT) up --build

# Start production services (detached)
up-prod:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_PRODUCTION) up --build -d

# Start production services (non-detached)
up-prod-non:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_PRODUCTION) up --build

# Stop development services
down-dev:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEVELOPMENT) down

# Stop production services
down-prod:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_PRODUCTION) down

# Restart services
restart-dev: down-dev up-dev-non
restart-prod: down-prod up-prod-non