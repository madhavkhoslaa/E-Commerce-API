FROM node:latest
ARG PORT
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE $PORT
CMD ["node", "src/index.js"]