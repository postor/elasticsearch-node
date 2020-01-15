FROM node

WORKDIR /app

COPY package.json package.json

RUN set -x && yarn

COPY . .

RUN set -x && yarn build

ENV NODE_ENV=production

CMD node app.js