FROM node:16-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm run db:seed

COPY . .

EXPOSE 4000
CMD npm run dev
