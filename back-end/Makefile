#######################################################################
# OLDPERTH BACK-END COMMANDS
#######################################################################

CONFIG_PATH = deploy/.env
include $(CONFIG_PATH)
export $(shell sed 's/=.*//' $(CONFIG_PATH))

DOCKER_COMMAND = docker exec -it $(CONTAINER_APP_NAME) bash -c
CONFIG_FILE = "/home/back-end/config/settings.ini"

.PHONY: 
	build load parse export generate \
	_load _parse _export _generate

build: up _load _parse _export _generate stop deploy

load: up _load stop

_load:
	$(DOCKER_COMMAND) "thickshake load -c $(CONFIG_FILE)"

parse: up _parse stop

_parse:
	$(DOCKER_COMMAND) "thickshake augment run_parsers -c $(CONFIG_FILE)"

export: up _export stop

_export:
	$(DOCKER_COMMAND) "thickshake export query -f -s 0 -c $(CONFIG_FILE)"

generate: up _generate stop

_generate:
	$(DOCKER_COMMAND) "python3 -m back-end.oldperth.oldperth"

#######################################################################
# THICKSHAKE COMMANDS
#######################################################################

THICKSHAKE_MAKE_DIR = deploy/
THICKSHAKE_MAKE = $(MAKE) -C $(THICKSHAKE_MAKE_DIR) 

.PHONY: start stop restart up freeze notebook dashboard shell

start:
	$(THICKSHAKE_MAKE) start

stop:
	$(THICKSHAKE_MAKE) stop

restart:
	$(THICKSHAKE_MAKE) restart

up:
	$(THICKSHAKE_MAKE) up

freeze:
	$(THICKSHAKE_MAKE) freeze

notebook:
	$(THICKSHAKE_MAKE) notebook

dashboard:
	$(THICKSHAKE_MAKE) dashboard

shell:
	$(THICKSHAKE_MAKE) shell

#######################################################################