#######################################################################
# HIGH-LEVEL COMMANDS
#######################################################################

.PHONY: deploy

deploy: export generate serve

#######################################################################
# FRONT-END COMMANDS
#######################################################################

FRONT_END_DIR = front-end/
FRONT_END_NPM = npm --prefix $(FRONT_END_DIR) 

.PHONY: serve build_front install_npm

serve:
	$(FRONT_END_NPM) run start

build_front:
	$(FRONT_END_NPM) run build

install_npm:
	$(FRONT_END_NPM) install

#######################################################################
# BACK-END COMMANDS
#######################################################################

BACK_END_MAKE_DIR = back-end/
BACK_END_MAKE = $(MAKE) -C $(BACK_END_MAKE_DIR) 

.PHONY: build_back load parse export generate

build_back:
	$(BACK_END_MAKE) build

load:
	$(BACK_END_MAKE) load

parse:
	$(BACK_END_MAKE) parse

export:
	$(BACK_END_MAKE) export

generate:
	$(BACK_END_MAKE) generate

#######################################################################
# THICKSHAKE COMMANDS
#######################################################################

THICKSHAKE_MAKE_DIR = back-end/deploy/
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