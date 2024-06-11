FROM node:19

WORKDIR /usr/src/app

CMD ["npx", "nodemon", "index.js"]

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app/