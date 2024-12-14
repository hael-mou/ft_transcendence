
SRCS := sources

all: up

.header:
	@echo "\033[32m @@@@@@@  @@@ @@@  @@@  @@@@@@@   @@@@@@       @@@@@@@  @@@ @@@  @@@  @@@@@@@   @@@@@@ ";
	@echo "\033[32m @@!  @@@ @@! @@!@!@@@ !@@       @@!  @@@      @@!  @@@ @@! @@!@!@@@ !@@       @@!  @@@";
	@echo "\033[32m @!@@!@!  !!@ @!@@!!@! !@! @!@!@ @!@  !@!      @!@@!@!  !!@ @!@@!!@! !@! @!@!@ @!@  !@!";
	@echo "\033[32m !!:      !!: !!:  !!! :!!   !!: !!:  !!!      !!:      !!: !!:  !!! :!!   !!: !!:  !!!";
	@echo "\033[32m  :       :   ::    :   :: :: :   : :. :        :       :   ::    :   :: :: :   : :. : ";
	@echo "\033[0m";

help:
	@echo "Makefile commands: (SERVICE=<service_name> to specific service)"
	@echo "  all        - Start the project (clean, build, up)"
	@echo "  up         - Start the containers and build the images"
	@echo "  down       - Stop and remove the containers"
	@echo "  clean      - Stop and remove containers, images, and volumes"
	@echo "  logs       - View logs from the containers or a specific service"
	@echo "  status     - Show the status of the containers or a specific service."
	@echo "  restart    - Restart the project or specific service"
	@echo "  prune      - Clean up unused Docker objects (stopped containers, networks, etc.)"
	@echo "  help       - Display this help message"

up: .header
	@docker-compose -f ${SRCS}/docker-compose.yml up -d --build

down:
	@docker-compose -f ${SRCS}/docker-compose.yml down --remove-orphans

# clean: down
# 	@docker-compose -f ${SRCS}/docker-compose.yml down --volumes --rmi all --remove-orphans

logs:
	@docker-compose -f ${SRCS}/docker-compose.yml logs -f -t $(if $(SERVICE),$(SERVICE),)

status:
	@docker-compose -f ${SRCS}/docker-compose.yml ps --all $(if $(SERVICE),$(SERVICE),)

restart:
	@docker-compose -f ${SRCS}/docker-compose.yml restart $(if $(SERVICE),$(SERVICE),)

prune:
	@docker system prune -f

.PHONY: all up down clean logs status restart prune
