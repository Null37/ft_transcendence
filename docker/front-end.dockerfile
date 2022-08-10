from node

workdir /root

copy tools/fron-end/build.sh /root/.
copy tools/fron-end/enterpoint.sh /root/.

RUN bash /root/build.sh

workdir /front-end

CMD bash /root/enterpoint.sh

