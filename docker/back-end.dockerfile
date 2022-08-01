from node

workdir /root

copy tools/back-end/build.sh /root/.
copy tools/back-end/enterpoint.sh /root/.

RUN bash /root/build.sh


CMD bash /root/enterpoint.sh

