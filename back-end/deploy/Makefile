#######################################################################
# PREAMBLE
#######################################################################

MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := start
.DELETE_ON_ERROR:
.SUFFIXES:
CURRENT_DIR = $(shell echo $(CURDIR) | sed 's|^/[^/]*||')
.PHONY:
	start stop restart up _up \
	freeze notebook dashboard shell volume \

#######################################################################
# CONFIGURATION
#######################################################################

CONFIG_PATH = ./.env
include $(CONFIG_PATH)
export $(shell sed 's/=.*//' $(CONFIG_PATH))

#######################################################################
# APP COMMANDS
#######################################################################

start: up shell

stop:
	-docker-compose --file $(DOCKER_COMPOSE_DIR)/docker-compose.yml down

restart: stop start

up: volume _up

_up: 
	PROJECT_NAME=$(PROJECT_NAME) \
	APP_IMAGE=$(APP_IMAGE) \
	APP_VERSION=$(APP_VERSION) \
	DB_IMAGE=$(DB_IMAGE) \
	DB_VERSION=$(DB_VERSION) \
	DBMGR_IMAGE=$(DBMGR_IMAGE) \
	DBMGR_VERSION=$(DBMGR_VERSION) \
	docker-compose --file $(DOCKER_COMPOSE_DIR)/docker-compose.yml up --build -d

#######################################################################

freeze:
	-docker exec -it $(PROJECT_NAME)_app bash -c "pip3 freeze > $(REQUIREMENTS_PATH)"

notebook:
	-explorer.exe "http://localhost:8888/tree"

dashboard:
	-explorer.exe "http://localhost:5050/"

shell:
	-docker exec -it $(PROJECT_NAME)_app $(SHELL)

volume:
	-docker volume create --name=$(PROJECT_NAME)_db_data

#######################################################################