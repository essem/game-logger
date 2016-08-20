FROM nodesource/node:6

# Do 'npm run build' first

ENV NODE_ENV production

RUN apt-get update

ADD package.json package.json
RUN npm install
ADD . .

CMD ["npm","start"]

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
