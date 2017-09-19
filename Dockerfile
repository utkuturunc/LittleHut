FROM node:8.5.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir /app
WORKDIR /app

ADD package.json /app/package.json
RUN yarn

COPY . /app

EXPOSE 2000

CMD [ "yarn", "start" ]
