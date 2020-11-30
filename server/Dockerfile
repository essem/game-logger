FROM node:8

RUN mkdir /src
WORKDIR /src
ADD package.json /src/package.json
RUN npm install
ADD . /src

CMD ["npm", "start"]
