FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine as production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json* ./

RUN apk add --no-cache curl && npm ci --only=production

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]

FROM node:18-alpine as development

ENV NODE_ENV=development
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]

FROM alpine:latest as benchmark

RUN apk add --no-cache wrk curl bash

COPY benchmark.lua /benchmark/benchmark.lua
COPY benchmark-commands.sh /benchmark/benchmark-commands.sh

RUN chmod +x /benchmark/benchmark-commands.sh

WORKDIR /benchmark

ENTRYPOINT ["/bin/bash"]