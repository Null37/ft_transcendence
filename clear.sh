#!/bin/bash

UNAME_S=$(uname -s)

if [ $UNAME_S == "Linux" ]
then
        PERM="sudo"
else
        PERM=""
fi

 $PERM docker-compose down
# rm -rf /var/lib/docker/volumes/elk-stack_certs
 $PERM docker stop $($PERM docker ps -qa);
 $PERM docker rm -f $($PERM docker ps -qa);
#  docker rmi -f node;
#  docker system prune -f


 $PERM docker volume rm $($PERM docker volume ls -q);
 $PERM docker network rm $($PERM docker network ls -q) 2>/dev/null
 $PERM docker-compose up --build
