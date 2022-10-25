FROM node:current

EXPOSE 8080

RUN npm install -g bower grunt-cli http-server

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY bower.json ./
ENV GIT_DIR=.
RUN bower install

COPY . ./
RUN grunt
COPY ./ops/development/settings.js ./build/settings.js

CMD http-server
