FROM node

WORKDIR /SQLite

COPY package.json /SQLite

RUN npm install 

COPY . .

EXPOSE 8050

CMD [ "node", "index.js" ]