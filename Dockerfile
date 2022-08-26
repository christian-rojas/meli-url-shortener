FROM node:16-alpine3.16

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./

ENV PORT=8080
ENV AWS_ACCESS_KEY_ID=AKIATWM2GRAOVUMYJI6R
ENV AWS_SECRET_ACCES_KEY=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
ENV AWS_DEFAULT_REGION=us-east-1

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/index.js" ]