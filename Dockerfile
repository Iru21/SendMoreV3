FROM alpine:3.14
<<<<<<< HEAD
EXPOSE 19713/tcp
EXPOSE 2137/tcp
=======
EXPOSE 3000/tcp
EXPOSE 19713/tcp
>>>>>>> 790c5b9e7ceff635b79d7c93d8117e82677e35e9
ADD src/ /home
WORKDIR /home
RUN apk add --no-cache npm yarn nodejs-current
RUN npm i -g concurrently ts-node
RUN npm i
RUN cd site
RUN yarn install
RUN cd ..
ENTRYPOINT npm start