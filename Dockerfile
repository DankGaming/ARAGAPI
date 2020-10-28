FROM node:14.13.0-alpine3.11

RUN npm install -g npm

WORKDIR /app
COPY package*.json ./
RUN npm install --verbose

COPY . .

CMD ["npm", "run", "start"]