docker-compose down







docker stop $( docker ps -qa);
docker volume rm $( docker volume ls -q);
docker network rm $( docker network ls -q) 2>/dev/null
docker-compose up --build