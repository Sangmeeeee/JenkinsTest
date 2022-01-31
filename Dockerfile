FROM node:17
RUN npm install
EXPOSE 80
CMD [ "node", "index.js" ]