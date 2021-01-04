FROM node:12-alpine

WORKDIR /app
ENV NODE_ENV production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .

EXPOSE 3000
CMD ["node", "./src/index.js"]
