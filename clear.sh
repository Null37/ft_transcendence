 docker-compose down
# rm -rf /var/lib/docker/volumes/elk-stack_certs
 docker stop $( docker ps -qa);
 docker rm -f $( docker ps -qa);
#  docker rmi -f node;
#  docker system prune -f


 docker volume rm $( docker volume ls -q);
 docker network rm $( docker network ls -q) 2>/dev/null
 docker-compose up --build