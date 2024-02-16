FROM node:latest

WORKDIR /bot

COPY package*.json ./

RUN npm install

COPY .env .env ./

COPY . .

CMD ["node", "dist/index.js"]