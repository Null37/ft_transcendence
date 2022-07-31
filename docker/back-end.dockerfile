from node

workdir /root

copy tools/build.sh /root/.
copy tools/enterpoint.sh /root/.

RUN bash /root/build.sh


CMD bash /root/enterpoint.sh

