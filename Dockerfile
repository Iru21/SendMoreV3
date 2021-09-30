FROM alpine:3.14
EXPOSE 19713/tcp
EXPOSE 2137/tcp
ADD src/ /home
WORKDIR /home
RUN apk add --no-cache npm yarn nodejs-current
RUN npm i -g concurrently ts-node
RUN npm i
RUN cd site
RUN yarn install
RUN cd ..
ENTRYPOINT npm start