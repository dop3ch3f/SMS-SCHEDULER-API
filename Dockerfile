FROM mhart/alpine-node:12

WORKDIR /usr/src/app

# update and install dependency
RUN apk update && apk upgrade
RUN apk --no-cache add --virtual builds-deps build-base python


COPY package.json .
RUN npm install -g nodemon
RUN npm install

COPY . .
