#!/bin/bash

UNAME_S=$(uname -s)

if [ $UNAME_S == "Linux" ]
then
        PERM="sudo"
else
        PERM=""
fi

$PERM docker-compose down
$PERM docker stop $($PERM docker ps -qa) 2>/dev/null;
$PERM docker rm -f $($PERM docker ps -qa) 2>/dev/null;
#$PERM docker rmi $($PERM docker images -qa); # slows building time, not necessary # but to be sure
#$PERM docker system prune -f


$PERM docker volume rm $($PERM docker volume ls -q) 2>/dev/null;
$PERM docker network rm $($PERM docker network ls -q) 2>/dev/null;
$PERM docker-compose up --build