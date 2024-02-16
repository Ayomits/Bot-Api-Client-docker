# Base image
FROM node:latest

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env ./

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]