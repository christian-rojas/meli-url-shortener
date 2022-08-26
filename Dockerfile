FROM node:16-alpine3.16

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

ENV PORT=8080

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/index.js" ]