 docker-compose down

 docker stop $( docker ps -qa);

 docker rm -f $( docker ps -qa);

#  docker rmi  -f ft_transcendence_fron-end 
#  docker rmi  -f ft_transcendence_back-end
#  docker rmi  -f postgres 

 #docker rmi -f node;

 docker system prune -f

 docker volume rm $( docker volume ls -q);
 docker network rm $( docker network ls -q) 2>/dev/null
 docker-compose up --build