FROM node:17
WORKDIR /usr/src/app
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "index.js" ]