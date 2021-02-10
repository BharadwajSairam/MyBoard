FROM node:10-alpine
WORKDIR /x
COPY package.json /x
RUN npm install
COPY . /x
EXPOSE 80
CMD node index.js