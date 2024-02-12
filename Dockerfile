FROM node:18.14.2
WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .

# docker-compose already set NODE_ENV=docker
CMD npx sequelize db:migrate && npx sequelize db:seed:all && npm run start
