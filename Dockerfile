FROM node:15
WORKDIR .
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "index.js" ]