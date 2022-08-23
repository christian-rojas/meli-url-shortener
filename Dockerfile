FROM node:16-alpine3.16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

ENV PORT=8080

COPY . ./

RUN npm install

RUN npm run build


# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

EXPOSE 8080
CMD [ "node", "dist/index.js" ]