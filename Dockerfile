FROM node

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

RUN yarn build

ENV NODE_ENV=production

CMD node app.js