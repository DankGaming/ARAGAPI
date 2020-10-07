FROM node:14.0

RUN npm install -g npm

WORKDIR /app
COPY package.json ./
# RUN npm cache clean --force && rm -rf node_modules
# RUN npm cache verify
RUN npm install --verbose && npm install tsc -g
# RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

#CMD ["/bin/bash"]