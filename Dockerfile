FROM node:alpine3.10

WORKDIR /app

COPY package.json package.json

RUN set -x && yarn

COPY . .

RUN set -x && yarn build

ENV NODE_ENV=production

RUN set -x && chmod +x wait-for.sh

CMD node app.js