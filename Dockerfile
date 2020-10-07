FROM node:14.0

RUN npm install -g npm

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]