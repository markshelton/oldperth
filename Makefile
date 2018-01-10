MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

PROJECT_DIR = $(shell echo $(CURDIR) | sed 's|^/[^/]*||')

CONFIG ?= ./back-end/src/config/config.env
include $(CONFIG)
export $(shell sed 's/=.*//' $(CONFIG))

APP_NAME = "$(REPO_NAME)/$(PROJECT_NAME)"

.DEFAULT_GOAL := start

.PHONY: build
build: prebuild; docker build -t $(PROJECT_NAME) -f $(DOCKERFILE_PATH) $(BUILD_CONTEXT)

.PHONY: jupyter
jupyter:
	sleep 3
	-explorer.exe "http://localhost:8888/tree"

.PHONY: prebuild
prebuild:
	npm list -g dockerignore --depth=0 || npm install -g dockerignore
	dockerignore -g="$(GITIGNORE_PATH)" -D="$(DOCKERIGNORE_PATH)"

.PHONY: restart
restart: stop start

.PHONY: run
run: 
	docker run -td --rm --name="$(PROJECT_NAME)" \
		-p 8888:8888 -p 6006:6006 \
		-v $(PROJECT_DIR):/home/app/ \
		$(PROJECT_NAME)

.PHONY: shell
shell:
	docker exec -it $(PROJECT_NAME) /bin/bash

.PHONY: start
start: build run shell

.PHONY: stop
stop:
	-docker exec -it $(PROJECT_NAME) /bin/bash -c "pip3 freeze > $(REQUIREMENTS_PATH)"
	-docker stop $(PROJECT_NAME)