from node

workdir /root

copy tools/fron-end/build.sh /root/.
copy tools/fron-end/enterpoint.sh /root/.

RUN bash /root/build.sh


CMD bash /root/enterpoint.sh

