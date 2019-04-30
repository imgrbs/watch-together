FROM node:8.9.2-alpine

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", "/app/server.js" ]