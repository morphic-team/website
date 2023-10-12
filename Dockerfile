#
# Node.js w/ Bower & Grunt Dockerfile
#
# https://github.com/digitallyseamless/docker-nodejs-bower-grunt
#

# Pull base image.
FROM node:20-bookworm-slim

# Install Git (which is needed by bower)
RUN apt-get update && apt-get install -y git

# Install Bower & Grunt
RUN npm install -g bower grunt-cli && \
    echo '{ "allow_root": true }' > /root/.bowerrc

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
