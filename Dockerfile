## Imagen
FROM node:14.17.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules build
RUN npm i
RUN npm install --arch=x64 --platform=linux sharp


COPY . .

RUN npm run build

EXPOSE 3333

CMD [ "npm", "start" ]