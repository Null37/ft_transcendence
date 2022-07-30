sudo docker-compose down
#sudo rm -rf /var/lib/docker/volumes/elk-stack_certs
sudo docker stop $(sudo docker ps -qa);
sudo docker rm -f $(sudo docker ps -qa);
#sudo docker rmi -f pgadmin;

sudo docker volume rm $(sudo docker volume ls -q);
sudo docker network rm $(sudo docker network ls -q) 2>/dev/null
sudo docker-compose up
